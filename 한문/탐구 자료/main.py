import json
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split

# 1. 하이퍼파라미터 설정
DEVICE = torch.device('cuda' if torch.cuda.is_available() else ('mps' if torch.backends.mps.is_available() else 'cpu'))
BATCH_SIZE = 32
LEARNING_RATE = 0.001
EPOCHS = 100

print(f"현재 연산 장치: {DEVICE}")

# 2. 커스텀 한자 데이터셋 정의
class HanjaDataset(Dataset):
    def __init__(self, json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 50개 한자 라벨 리스트 생성 (순서 보장)
        self.labels = [
            "校", "敎", "九", "國", "軍", "金", "南", "女", "年", "大",
            "東", "六", "萬", "母", "木", "門", "民", "白", "父", "北",
            "四", "山", "三", "生", "西", "先", "小", "水", "室", "十",
            "五", "王", "外", "月", "二", "人", "一", "日", "長", "弟",
            "中", "靑", "寸", "七", "土", "八", "學", "韓", "兄", "火"
        ]
        # 한자 글자를 0~49 인덱스로 변환하는 딕셔너리
        self.label_to_idx = {char: idx for idx, char in enumerate(self.labels)}
        
        self.inputs = []
        self.targets = []
        
        for item in data:
            # 1차원 배열(784)을 28x28 2차원으로 복원 및 채널 차원 추가 (1, 28, 28)
            img = np.array(item['input'], dtype=np.float32).reshape(1, 28, 28)
            # 수집기 데이터 특성에 맞춘 간단한 정규화 (선택사항)
            self.inputs.append(img)
            
            # 정답 한자를 숫자 인덱스로 변환
            label_idx = self.label_to_idx[item['output']]
            self.targets.append(label_idx)
            
        self.inputs = np.array(self.inputs)
        self.targets = np.array(self.targets)

    def __len__(self):
        return len(self.inputs)

    def __getitem__(self, idx):
        return torch.tensor(self.inputs[idx]), torch.tensor(self.targets[idx], dtype=torch.long)

# 데이터셋 로드 및 분할 (학습 80% : 검증 20%)
full_dataset = HanjaDataset('hanja_8grade_dataset.json')
train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size

train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)

# 3. 한자용 정석 CNN 모델 설계
class HanjaCNN(nn.Module):
    def __init__(self):
        super(HanjaCNN, self).__init__()
        # 입력 형태: (Batch, 1, 28, 28)
        self.features = nn.Sequential(
            # 첫 번째 합성곱 블록 (채널 분리 추출)
            nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            # 맥스 풀링 (2x2 커널, 스트라이드 2 -> 크기 절반 감소: 28x28 -> 14x14)
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # 두 번째 합성곱 블록 (복잡한 한자 특징 추출을 위해 레이어 추가)
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            # 크기 재감소: 14x14 -> 7x7
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        
        # 완전연결층 (Fully Connected)
        # 최종 특징 맵 크기: 64채널 * 7px * 7px = 3,136 차원
        self.classifier = nn.Sequential(
            nn.Linear(64 * 7 * 7, 256),
            nn.ReLU(),
            nn.Dropout(0.3), # 과적합 방지
            nn.Linear(256, 50) # 최종 클래스 개수: 50개 한자
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1) # 1차원으로 펼치기 (Flatten)
        x = self.classifier(x)
        return x

model = HanjaCNN().to(DEVICE)

# 4. 손실 함수와 옵티마이저 정의
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# 5. 학습 루프
for epoch in range(EPOCHS):
    model.train()
    train_loss = 0.0
    correct = 0
    total = 0
    
    for inputs, targets in train_loader:
        inputs, targets = inputs.to(DEVICE), targets.to(DEVICE)
        
        # 순방향 연산
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        
        # 역전파 및 업데이트
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        train_loss += loss.item()
        _, predicted = outputs.max(1)
        total += targets.size(0)
        correct += predicted.eq(targets).sum().item()
        
    # 검증(Validation) 평가
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for inputs, targets in val_loader:
            inputs, targets = inputs.to(DEVICE), targets.to(DEVICE)
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            
            val_loss += loss.item()
            _, predicted = outputs.max(1)
            val_total += targets.size(0)
            val_correct += predicted.eq(targets).sum().item()
            
    print(f"Epoch [{epoch+1}/{EPOCHS}] "
          f"| Train Loss: {train_loss/len(train_loader):.4f} | Train Acc: {100.*correct/total:.2f}% "
          f"| Val Loss: {val_loss/len(val_loader):.4f} | Val Acc: {100.*val_correct/val_total:.2f}%")

# 6. 학습된 가중치 모델 저장
torch.save(model.state_dict(), "hanja_cnn_model.pth")
print("\n🎉 모델 학습 완료 및 가중치(hanja_cnn_model.pth) 저장 성공!")
