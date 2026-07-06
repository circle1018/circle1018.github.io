import json
import numpy as np
import torch
import torch.nn as nn

# 1. 연산 장치 및 한자 리스트 설정 (학습할 때와 완벽히 일치해야 함)
DEVICE = torch.device('cuda' if torch.cuda.is_available() else ('mps' if torch.backends.mps.is_available() else 'cpu'))

LABELS = [
    "校", "敎", "九", "國", "軍", "金", "南", "女", "年", "大",
    "東", "六", "萬", "母", "木", "門", "民", "白", "父", "北",
    "四", "山", "三", "生", "西", "先", "小", "水", "室", "十",
    "五", "王", "外", "月", "二", "人", "一", "日", "長", "弟",
    "중", "靑", "寸", "七", "土", "八", "學", "韓", "兄", "火"
]
label_to_idx = {char: idx for idx, char in enumerate(LABELS)}

# 2. CNN 모델 구조 정의
class HanjaCNN(nn.Module):
    def __init__(self):
        super(HanjaCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        self.classifier = nn.Sequential(
            nn.Linear(64 * 7 * 7, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 50)
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x

# 3. 가중치 로드
model = HanjaCNN().to(DEVICE)
try:
    model.load_state_dict(torch.load("hanja_cnn_model.pth", map_location=DEVICE))
    model.eval()
    print("✅ 가중치(hanja_cnn_model.pth) 로드 성공!\n")
except FileNotFoundError:
    print("❌ 'hanja_cnn_model.pth' 가중치 파일이 없습니다. 먼저 학습을 완료해 주세요.")
    exit()

# 4. JSON 테스트 데이터 불러오기
json_path = 'hanja_8grade_dataset.json' # 테스트하고 싶은 JSON 파일명
try:
    with open(json_path, 'r', encoding='utf-8') as f:
        test_data = json.load(f)
except FileNotFoundError:
    print(f"❌ '{json_path}' 파일을 찾을 수 없습니다.")
    exit()

print(f"📋 총 {len(test_data)}개의 데이터를 검증합니다...\n")

correct_count = 0

# 5. 데이터 하나씩 순회하며 예측 진행
for idx, item in enumerate(test_data):
    actual_hanja = item['output'] # 실제 정답 한자 문자열
    
    # 1차원 입력을 텐서 형태로 변환 (Batch=1, Channel=1, 28, 28)
    pixel_array = np.array(item['input'], dtype=np.float32).reshape(1, 1, 28, 28)
    img_tensor = torch.tensor(pixel_array).to(DEVICE)
    
    with torch.no_grad():
        outputs = model(img_tensor)
        # 소프트맥스로 확률 변환 후 최고 확률값과 인덱스 추출
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)
        
    predicted_hanja = LABELS[predicted_idx.item()]
    confidence_score = confidence.item() * 100
    
    # 정답 여부 판별
    is_correct = (actual_hanja == predicted_hanja)
    status_str = "✅ 맞음" if is_correct else "❌ 틀림"
    
    if is_correct:
        correct_count += 1
        
    # 결과 출력 (데이터가 많을 경우 일부만 보려면 상위 몇 개만 제한하셔도 됩니다)
    print(f"[{idx + 1:03d}] 실제정답: {actual_hanja} | AI예측: {predicted_hanja} ({confidence_score:.1f}%) -> {status_str}")

# 6. 최종 결과 요약 출력
total_data = len(test_data)
accuracy = (correct_count / total_data) * 100 if total_data > 0 else 0
print("\n==========================================")
print(f"📊 최종 평가 결과")
print(f"🎯 맞춘 개수: {correct_count} / {total_data}")
print(f"📈 최종 정확도(Accuracy): {accuracy:.2f}%")
print("==========================================")
