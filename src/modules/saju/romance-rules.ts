import type { EnrichedSajuResult } from "@/modules/saju/types";

export interface RomanceRule {
  id: string;
  category: '매력지수' | '연애스타일' | '이상형' | '주의사항';
  condition: (data: EnrichedSajuResult) => boolean;
  weight: number;
  interpretation: {
    title: string;
    description: string;
  };
  tags: string[];
}

export const ROMANCE_RULES: RomanceRule[] = [
  // ────────────────────────────────────────────────
  // 매력지수 (Charm Index)
  // ────────────────────────────────────────────────
  {
    id: 'CHARM_001',
    category: '매력지수',
    condition: (data) => data.도화살.strength === '없음',
    weight: 3,
    interpretation: {
      title: '은은한 매력',
      description:
        '화려하게 튀지 않아도 가까이 있을수록 빠져드는 스타일이야. 처음엔 평범해 보여도 알면 알수록 매력이 샘솟는 사주야. 오래 보는 사람일수록 네 진짜 매력을 알아채게 되어 있어.',
    },
    tags: ['도화살없음', '잔잔한매력', '내적매력'],
  },
  {
    id: 'CHARM_002',
    category: '매력지수',
    condition: (data) => data.도화살.strength === '약',
    weight: 5,
    interpretation: {
      title: '자연스러운 끌림',
      description:
        '억지로 꾸미지 않아도 이성이 자연스럽게 관심을 갖게 되는 에너지를 가지고 있어. 편안하고 친근한 분위기가 네 최고 무기야. 만나는 사람마다 "왜 자꾸 생각나지?" 하게 만드는 그런 매력이야.',
    },
    tags: ['도화살약', '자연스러운매력', '편안한분위기'],
  },
  {
    id: 'CHARM_003',
    category: '매력지수',
    condition: (data) => data.도화살.strength === '중',
    weight: 7,
    interpretation: {
      title: '강한 이성 매력',
      description:
        '이성에게 확실하게 눈에 띄는 매력을 가지고 있어. 사람들이 많은 자리에서도 네 존재감은 확실히 드러나는 편이야. 좋아하는 사람한테 먼저 다가오는 경우가 꽤 많은 사주야.',
    },
    tags: ['도화살중', '이성매력', '존재감'],
  },
  {
    id: 'CHARM_004',
    category: '매력지수',
    condition: (data) => data.도화살.strength === '강' || data.도화살.strength === '극강',
    weight: 9,
    interpretation: {
      title: '압도적 매력',
      description:
        '주변 이성이 그냥 지나치지 못하는 압도적인 끌림의 기운을 타고났어. 이성이 먼저 다가오고 관심을 받는 일이 일상인 사주야. 이 매력을 잘 활용하면 인생이 훨씬 풍요로워질 거야.',
    },
    tags: ['도화살강', '도화살극강', '압도적매력', '인기'],
  },
  {
    id: 'CHARM_005',
    category: '매력지수',
    condition: (data) => data.십성분포.식상 >= 2,
    weight: 6,
    interpretation: {
      title: '표현력 매력',
      description:
        '말하는 것, 감정을 드러내는 것을 잘하는 사주라 상대방을 설레게 하는 능력이 있어. 재미있고 유쾌한 에너지가 자연스럽게 흘러나와서 같이 있으면 지루할 틈이 없어. 감정 표현을 잘하니까 상대방도 마음을 열기 쉬운 거야.',
    },
    tags: ['식상', '표현력', '말매력', '유쾌함'],
  },
  {
    id: 'CHARM_006',
    category: '매력지수',
    condition: (data) => data.십성분포.재성 >= 2,
    weight: 5,
    interpretation: {
      title: '행동파 매력',
      description:
        '말보다 행동으로 보여주는 스타일이라 믿음직스럽고 든든한 매력이 있어. 좋아하는 사람한테 뭔가 해주고 싶어서 몸이 먼저 움직이는 타입이야. 그 실행력이 은근히 상대방 마음을 움직이게 되어 있어.',
    },
    tags: ['재성', '행동력', '실행력매력'],
  },
  {
    id: 'CHARM_007',
    category: '매력지수',
    condition: (data) => data.십성분포.관성 >= 2,
    weight: 5,
    interpretation: {
      title: '카리스마 매력',
      description:
        '어딘가 모르게 품위 있고 단단한 분위기가 있어서 이성이 신뢰하고 의지하고 싶어 해. 가볍게 다가가기 어려운 느낌이 오히려 매력 포인트야. 무게감 있는 존재감이 자연스럽게 카리스마로 느껴지거든.',
    },
    tags: ['관성', '카리스마', '신뢰감', '품위'],
  },
  {
    id: 'CHARM_008',
    category: '매력지수',
    condition: (data) => data.일간오행 === '화',
    weight: 4,
    interpretation: {
      title: '밝고 열정적인 매력',
      description:
        '불의 에너지를 타고나서 밝고 따뜻한 분위기가 사람을 끌어당겨. 옆에 있으면 기분이 좋아지는 사람, 그게 바로 너야. 열정적으로 무언가를 대하는 모습이 상대방 눈에 아주 매력적으로 보이거든.',
    },
    tags: ['화오행', '밝음', '열정', '따뜻함'],
  },
  {
    id: 'CHARM_009',
    category: '매력지수',
    condition: (data) => data.일간오행 === '수',
    weight: 4,
    interpretation: {
      title: '신비로운 분위기',
      description:
        '물의 기운을 가진 사람은 깊이를 알 수 없는 신비로운 매력이 있어. 표정이나 말에서 뭔가 더 있을 것 같은 느낌이 들어서 이성이 더 알고 싶어 하게 되거든. 쉽게 다 보여주지 않는 그 여백이 매력의 핵심이야.',
    },
    tags: ['수오행', '신비감', '깊이', '여백매력'],
  },
  {
    id: 'CHARM_010',
    category: '매력지수',
    condition: (data) => data.강약 === '신강' && data.십성분포.비겁 >= 2,
    weight: 6,
    interpretation: {
      title: '자신감 넘치는 매력',
      description:
        '자기 자신을 믿는 에너지가 강해서 자연스러운 자신감이 매력으로 이어지는 사주야. 위축되거나 쩔쩔매지 않는 그 태도가 상대방 눈에 굉장히 멋있게 보여. 스스로를 잘 챙기는 모습이 오히려 이성을 더 끌어당기는 거야.',
    },
    tags: ['신강', '비겁', '자신감', '당당함'],
  },

  // ────────────────────────────────────────────────
  // 연애스타일 (Dating Style)
  // ────────────────────────────────────────────────
  {
    id: 'STYLE_001',
    category: '연애스타일',
    condition: (data) => data.십성분포.비겁 >= 3,
    weight: 7,
    interpretation: {
      title: '독립적 연애',
      description:
        '연애를 해도 내 삶과 나만의 공간이 확실히 있어야 하는 스타일이야. 붙어 있는 것보다 서로 독립적으로 살면서 만나는 관계가 더 잘 맞아. 상대방이 내 모든 시간을 차지하려 하면 오히려 거리감이 생기는 타입이야.',
    },
    tags: ['비겁', '독립', '자유로운연애', '개인공간'],
  },
  {
    id: 'STYLE_002',
    category: '연애스타일',
    condition: (data) => data.십성분포.식상 >= 3,
    weight: 7,
    interpretation: {
      title: '표현적 연애',
      description:
        '좋으면 좋다, 보고 싶으면 보고 싶다 — 감정을 숨기지 못하고 다 표현하는 연애를 하게 되어 있어. 상대방한테 먼저 연락하고 먼저 설레는 감정을 꺼내는 쪽이야. 그 솔직하고 적극적인 표현이 상대방한테 큰 행복이 돼.',
    },
    tags: ['식상', '표현적연애', '솔직함', '적극표현'],
  },
  {
    id: 'STYLE_003',
    category: '연애스타일',
    condition: (data) => data.십성분포.재성 >= 3,
    weight: 7,
    interpretation: {
      title: '적극적 연애',
      description:
        '마음에 드는 사람이 생기면 행동으로 먼저 보여주는 스타일이야. 데이트 계획도 선물도 먼저 챙기고, 좋아하는 감정을 행동으로 증명하는 타입이거든. 그 실행력과 챙김이 상대방한테 큰 안정감과 설렘을 동시에 줘.',
    },
    tags: ['재성', '적극적연애', '행동파', '챙김'],
  },
  {
    id: 'STYLE_004',
    category: '연애스타일',
    condition: (data) => data.십성분포.관성 >= 3,
    weight: 7,
    interpretation: {
      title: '진지한 연애',
      description:
        '가볍게 만나고 헤어지는 연애는 잘 맞지 않아. 만나면 책임감을 가지고 진지하게 대하는 편이라 상대방도 너를 믿고 의지하게 돼. 연애에서도 규칙과 질서를 중요하게 생각하는 원칙주의 타입이야.',
    },
    tags: ['관성', '진지한연애', '책임감', '원칙'],
  },
  {
    id: 'STYLE_005',
    category: '연애스타일',
    condition: (data) => data.십성분포.인성 >= 3,
    weight: 7,
    interpretation: {
      title: '신중한 연애',
      description:
        '연애를 시작하기 전에 상대방을 충분히 파악하고 싶어 하는 신중한 타입이야. 감정이 확신으로 바뀔 때까지 천천히 다가가는 편이라 연애가 느리게 시작되기도 해. 대신 한번 마음을 열면 깊고 진한 관계가 되는 사주야.',
    },
    tags: ['인성', '신중한연애', '깊은관계', '천천히'],
  },
  {
    id: 'STYLE_006',
    category: '연애스타일',
    condition: (data) => data.강약 === '신강',
    weight: 5,
    interpretation: {
      title: '주도하는 연애',
      description:
        '연애에서 자연스럽게 리드하는 역할을 맡는 경우가 많아. 어디 갈지, 뭘 먹을지 결정하는 것도 네가 하는 게 더 편하고 자연스러운 사주야. 상대방이 따라와 주는 걸 좋아하고, 그게 잘 맞는 관계에서 더 빛나게 돼.',
    },
    tags: ['신강', '리드', '주도적연애'],
  },
  {
    id: 'STYLE_007',
    category: '연애스타일',
    condition: (data) => data.강약 === '신약',
    weight: 5,
    interpretation: {
      title: '맞춰주는 연애',
      description:
        '상대방의 감정과 상황에 잘 맞춰주는 따뜻한 연애를 하는 타입이야. 내가 좀 불편해도 상대방이 편하면 괜찮다고 느끼는 경우가 많아. 그 배려심이 관계를 오래 유지시키는 힘이 되지만, 가끔은 내 감정도 챙겨야 해.',
    },
    tags: ['신약', '배려', '맞춰주는연애', '따뜻함'],
  },
  {
    id: 'STYLE_008',
    category: '연애스타일',
    condition: (data) => data.일간오행 === '목',
    weight: 4,
    interpretation: {
      title: '성장 추구형 연애',
      description:
        '연애를 하면서 서로 같이 성장하고 발전하는 것에 큰 의미를 두는 타입이야. 나무처럼 위로 자라나는 에너지를 가진 사람이라 정체된 관계보다 함께 뭔가를 이루어 가는 관계가 잘 맞아. 목표가 같은 사람과 만나면 엄청난 시너지가 나.',
    },
    tags: ['목오행', '성장', '발전', '목표지향연애'],
  },
  {
    id: 'STYLE_009',
    category: '연애스타일',
    condition: (data) => data.일간오행 === '토',
    weight: 4,
    interpretation: {
      title: '안정 추구형 연애',
      description:
        '흙의 기운처럼 변하지 않는 안정감을 연애에서 가장 중요하게 여겨. 드라마 같은 감정 기복보다 매일 꾸준히 서로를 확인하는 관계가 훨씬 편해. 한번 시작한 관계를 소중히 지키려는 마음이 강한 사주야.',
    },
    tags: ['토오행', '안정', '꾸준함', '지속성'],
  },
  {
    id: 'STYLE_010',
    category: '연애스타일',
    condition: (data) => data.일간오행 === '금',
    weight: 4,
    interpretation: {
      title: '기준 확고형 연애',
      description:
        '쇠처럼 단단한 기준이 있어서 이게 아니다 싶으면 미련 없이 정리하는 편이야. 이상형에 대한 기준이 명확하고 그 기준을 쉽게 낮추지 않는 타입이거든. 그 선명한 기준 덕분에 맞는 사람을 만나면 흔들림 없는 관계를 만들어.',
    },
    tags: ['금오행', '기준', '확고함', '원칙'],
  },
  {
    id: 'STYLE_011',
    category: '연애스타일',
    condition: (data) =>
      (data.도화살.strength === '강' || data.도화살.strength === '극강') &&
      data.십성분포.식상 >= 2,
    weight: 8,
    interpretation: {
      title: '화끈한 연애',
      description:
        '끌리면 바로 다가가고, 좋으면 바로 표현하는 화끈한 연애 스타일이야. 강한 매력에 표현력까지 갖춰서 상대방이 네 페이스에 휩쓸리는 경우가 많아. 연애에서 불꽃 같은 설렘을 만들어내는 능력이 특별한 사주야.',
    },
    tags: ['도화살강', '식상', '화끈함', '적극표현', '설렘'],
  },
  {
    id: 'STYLE_012',
    category: '연애스타일',
    condition: (data) => data.십성분포.인성 >= 2 && data.강약 === '신약',
    weight: 6,
    interpretation: {
      title: '감성적 연애',
      description:
        '감정이 풍부하고 상대방의 마음에 잘 공감하는 감성적인 연애를 해. 분위기 있는 장소, 감성적인 선물, 마음에 와닿는 말 한마디에 크게 움직이는 타입이야. 그 섬세한 감수성이 관계를 더 깊고 풍성하게 만드는 힘이야.',
    },
    tags: ['인성', '신약', '감성적연애', '공감', '섬세함'],
  },

  // ────────────────────────────────────────────────
  // 이상형 (Ideal Type)
  // ────────────────────────────────────────────────
  {
    id: 'IDEAL_001',
    category: '이상형',
    condition: (data) => data.일간오행 === '목',
    weight: 6,
    interpretation: {
      title: '물의 기운을 가진 사람',
      description:
        '나무는 물이 있어야 자라듯, 너는 물의 기운이 강한 사람 곁에서 가장 빛나. 차분하고 깊이 있으며 네 감정을 잘 받아주는 사람이 이상형이야. 말수가 적어도 든든하게 버텨주는 그런 사람이 네 마음을 가장 편하게 해줘.',
    },
    tags: ['목오행', '수생목', '물의기운', '이상형'],
  },
  {
    id: 'IDEAL_002',
    category: '이상형',
    condition: (data) => data.일간오행 === '화',
    weight: 6,
    interpretation: {
      title: '나무의 기운을 가진 사람',
      description:
        '불은 나무가 있어야 더 크게 타오르듯, 나무의 기운을 가진 사람이 너를 가장 잘 살려줘. 성장하고 발전하는 에너지를 가진 긍정적인 사람이 이상형이야. 너의 열정에 같이 불을 지펴주는 사람과 만나면 엄청난 시너지가 터져.',
    },
    tags: ['화오행', '목생화', '나무의기운', '이상형'],
  },
  {
    id: 'IDEAL_003',
    category: '이상형',
    condition: (data) => data.일간오행 === '토',
    weight: 6,
    interpretation: {
      title: '불의 기운을 가진 사람',
      description:
        '불이 타고 나면 흙이 생기듯, 따뜻한 불의 에너지를 가진 사람이 너와 잘 맞아. 밝고 열정적이며 주변을 따뜻하게 만드는 사람이 이상형이야. 그 활기찬 에너지가 너의 안정적인 면과 만나면 아주 좋은 균형을 이루게 돼.',
    },
    tags: ['토오행', '화생토', '불의기운', '이상형'],
  },
  {
    id: 'IDEAL_004',
    category: '이상형',
    condition: (data) => data.일간오행 === '금',
    weight: 6,
    interpretation: {
      title: '흙의 기운을 가진 사람',
      description:
        '흙에서 쇠가 만들어지듯, 안정적이고 묵직한 흙의 기운을 가진 사람이 너를 가장 잘 받쳐줘. 성실하고 믿음직스러우며 실속 있는 사람이 이상형이야. 흔들림 없이 네 곁을 지켜주는 그 든든함이 네 마음을 안정시켜 줘.',
    },
    tags: ['금오행', '토생금', '흙의기운', '이상형'],
  },
  {
    id: 'IDEAL_005',
    category: '이상형',
    condition: (data) => data.일간오행 === '수',
    weight: 6,
    interpretation: {
      title: '쇠의 기운을 가진 사람',
      description:
        '쇠가 녹아 물이 되듯, 단단하고 명확한 쇠의 기운을 가진 사람이 너와 잘 맞아. 기준이 확실하고 결단력 있는 사람이 이상형이야. 흐르는 물 같은 너에게 방향을 잡아주는 그 단단함이 심리적 안정감을 크게 줘.',
    },
    tags: ['수오행', '금생수', '쇠의기운', '이상형'],
  },
  {
    id: 'IDEAL_006',
    category: '이상형',
    condition: (data) => data.강약 === '신강',
    weight: 5,
    interpretation: {
      title: '부드럽고 유연한 사람',
      description:
        '에너지가 강하고 자기 주관이 뚜렷한 너에게는 부드럽고 유연하게 맞춰주는 사람이 잘 어울려. 강함과 강함이 부딪히면 서로 지치기 마련이거든. 편안하게 안아주는 느낌의 사람을 만나야 오래가는 관계가 돼.',
    },
    tags: ['신강', '이상형', '부드러움', '유연함', '균형'],
  },
  {
    id: 'IDEAL_007',
    category: '이상형',
    condition: (data) => data.강약 === '신약',
    weight: 5,
    interpretation: {
      title: '든든하고 리드하는 사람',
      description:
        '에너지가 섬세하고 배려심이 강한 너에게는 확실하게 리드해주는 든든한 사람이 이상형이야. 결정을 맡겨도 믿을 수 있고, 어려울 때 기댈 수 있는 그런 사람 곁에 있을 때 네가 가장 편안해. 네 따뜻함을 소중히 여기는 강한 사람이 딱이야.',
    },
    tags: ['신약', '이상형', '든든함', '리더십', '안정감'],
  },
  {
    id: 'IDEAL_008',
    category: '이상형',
    condition: (data) => data.십성분포.식상 === 0,
    weight: 5,
    interpretation: {
      title: '표현력 좋은 사람',
      description:
        '감정 표현이 서툰 편이라 먼저 감정을 꺼내주는 사람에게 마음이 열리는 타입이야. "좋아해", "보고 싶어" 같은 말을 자연스럽게 잘 하는 사람이 이상형이야. 그 표현들이 네 마음속 잠긴 감정을 살살 녹여주거든.',
    },
    tags: ['식상부족', '이상형', '표현력', '감정표현'],
  },
  {
    id: 'IDEAL_009',
    category: '이상형',
    condition: (data) => data.십성분포.재성 === 0,
    weight: 5,
    interpretation: {
      title: '행동력 있는 사람',
      description:
        '생각은 많지만 실행이 느린 편이라 먼저 치고 나가는 행동력 있는 사람에게 매력을 느껴. 계획 없이도 뭔가를 뚝딱 만들어내는 추진력 있는 사람이 이상형이야. 그 행동력이 너의 신중함과 만나면 꽤 환상적인 조합이 돼.',
    },
    tags: ['재성부족', '이상형', '행동력', '추진력'],
  },
  {
    id: 'IDEAL_010',
    category: '이상형',
    condition: (data) => data.십성분포.관성 === 0,
    weight: 5,
    interpretation: {
      title: '책임감 있는 사람',
      description:
        '자유롭게 흘러가는 걸 좋아하는 너에게 책임감 있고 믿음직한 사람이 큰 안정감을 줘. 약속을 지키고 말과 행동이 일치하는 사람이 이상형이야. 그 단단한 책임감이 너한테는 가장 큰 매력 포인트가 되는 거야.',
    },
    tags: ['관성부족', '이상형', '책임감', '신뢰'],
  },

  // ────────────────────────────────────────────────
  // 주의사항 (Red Flags / Avoid)
  // ────────────────────────────────────────────────
  {
    id: 'AVOID_001',
    category: '주의사항',
    condition: (data) => data.일간오행 === '목',
    weight: 6,
    interpretation: {
      title: '쇠의 기운 강한 사람 주의',
      description:
        '나무는 쇠에 잘리듯, 쇠의 기운이 강한 사람은 너를 상처 입힐 수 있어. 냉정하고 원칙적이며 감정보다 이성을 우선하는 타입과는 자주 부딪힐 수 있어. 처음엔 단단해 보여서 끌릴 수 있는데, 관계가 깊어질수록 상처받을 수 있으니 조심해.',
    },
    tags: ['목오행', '금극목', '쇠의기운', '주의'],
  },
  {
    id: 'AVOID_002',
    category: '주의사항',
    condition: (data) => data.일간오행 === '화',
    weight: 6,
    interpretation: {
      title: '물의 기운 강한 사람 주의',
      description:
        '불은 물로 꺼지듯, 물의 기운이 강한 사람은 너의 열정과 에너지를 식혀버릴 수 있어. 차갑고 감정을 잘 드러내지 않는 타입은 너의 활기를 죽이는 경우가 있거든. 오래 있으면 에너지가 빠지는 느낌이 든다면 그 관계를 다시 생각해봐.',
    },
    tags: ['화오행', '수극화', '물의기운', '주의'],
  },
  {
    id: 'AVOID_003',
    category: '주의사항',
    condition: (data) => data.일간오행 === '토',
    weight: 6,
    interpretation: {
      title: '나무의 기운 강한 사람 주의',
      description:
        '나무 뿌리가 흙을 파고들듯, 나무의 기운이 강한 사람은 너의 안정을 흔들 수 있어. 끊임없이 변화를 추구하고 자유를 원하는 타입은 안정을 원하는 너와 자주 충돌해. 처음엔 활기차 보여서 좋아 보이지만 장기적으로 피곤해질 수 있어.',
    },
    tags: ['토오행', '목극토', '나무의기운', '주의'],
  },
  {
    id: 'AVOID_004',
    category: '주의사항',
    condition: (data) => data.일간오행 === '금',
    weight: 6,
    interpretation: {
      title: '불의 기운 강한 사람 주의',
      description:
        '불이 쇠를 녹이듯, 불의 기운이 강한 사람은 너의 단단한 원칙을 흔들어버릴 수 있어. 감정적으로 격하고 충동적인 타입과는 자주 마찰이 생길 수 있어. 그 열정에 끌릴 수 있지만 장기적으로는 나의 기준이 무너지는 느낌을 받게 될 수 있어.',
    },
    tags: ['금오행', '화극금', '불의기운', '주의'],
  },
  {
    id: 'AVOID_005',
    category: '주의사항',
    condition: (data) => data.일간오행 === '수',
    weight: 6,
    interpretation: {
      title: '흙의 기운 강한 사람 주의',
      description:
        '흙이 물을 막듯, 흙의 기운이 강한 사람은 너의 흐름과 자유로움을 막아버릴 수 있어. 고집스럽고 변화를 싫어하는 타입은 너의 유동적인 에너지와 충돌할 수 있어. 처음엔 안정감이 있어 보여도 점점 답답하고 통제받는 느낌이 생길 수 있어.',
    },
    tags: ['수오행', '토극수', '흙의기운', '주의'],
  },
  {
    id: 'AVOID_006',
    category: '주의사항',
    condition: (data) => {
      // Check 천간십성 across all pillars (일주 천간십성 is always null — skip it)
      const pillars = [data.년주, data.월주, data.시주].filter(Boolean);
      return pillars.some((p) => p!.천간십성 === '겁재');
    },
    weight: 7,
    interpretation: {
      title: '질투 경쟁형 주의',
      description:
        '사주에 겁재의 기운이 있으면 연애에서 질투나 경쟁 심리가 올라오는 상황이 생길 수 있어. 상대방을 과도하게 통제하거나 내가 가진 것을 빼앗기는 느낌이 드는 관계를 조심해야 해. 건강한 자존심은 좋지만 경쟁 구도가 되는 관계는 서로를 지치게 만들어.',
    },
    tags: ['겁재', '질투', '경쟁', '주의'],
  },
  {
    id: 'AVOID_007',
    category: '주의사항',
    condition: (data) => {
      // Count 상관 across all pillars' 천간십성 and 지지십성
      let count = 0;
      const allPillars = [data.년주, data.월주, data.일주, data.시주].filter(Boolean);
      for (const p of allPillars) {
        if (p!.천간십성 === '상관') count++;
        count += p!.지지십성.filter((s) => s === '상관').length;
      }
      // Also count from distribution: 식상 includes 식신 + 상관
      // Use 십성분포.식상 - but that counts both; use raw pillar scan above
      return count >= 2;
    },
    weight: 6,
    interpretation: {
      title: '비판적인 사람 주의',
      description:
        '상관의 기운이 강하면 말이 날카롭고 상대방을 무의식중에 평가하거나 비판하는 경향이 생길 수 있어. 관계 안에서 자꾸 지적받는 느낌이 든다면 그건 나에게 맞지 않는 신호야. 나를 있는 그대로 받아주는 사람을 찾는 게 훨씬 행복해.',
    },
    tags: ['상관', '비판', '날카로움', '주의'],
  },
  {
    id: 'AVOID_008',
    category: '주의사항',
    condition: (data) => data.강약 === '신강' && data.십성분포.비겁 >= 3,
    weight: 7,
    interpretation: {
      title: '자기중심적 관계 주의',
      description:
        '에너지가 넘치고 자아가 강한 사주라 자신도 모르게 관계에서 내 방식대로 이끌려는 경향이 강해질 수 있어. 상대방의 의견이나 감정을 충분히 듣지 않고 넘어가는 상황이 생기지 않도록 주의해야 해. 나의 강함이 상대방에게 부담이 될 수 있다는 것을 기억해.',
    },
    tags: ['신강', '비겁과다', '자기중심', '주의'],
  },
  {
    id: 'AVOID_009',
    category: '주의사항',
    condition: (data) => data.십성분포.재성 >= 4,
    weight: 6,
    interpretation: {
      title: '감정 소진 주의',
      description:
        '행동력과 실행력이 너무 강하면 관계에서 혼자 다 챙기고 지쳐버리는 상황이 생길 수 있어. 상대방을 위해 너무 많은 에너지를 쏟다 보면 정작 내 감정은 돌보지 못하는 거야. 주고받는 균형이 맞는지 꼭 확인하고, 나도 받을 줄 알아야 해.',
    },
    tags: ['재성과다', '감정소진', '균형', '주의'],
  },
  {
    id: 'AVOID_010',
    category: '주의사항',
    condition: (data) => data.십성분포.관성 >= 4,
    weight: 7,
    interpretation: {
      title: '과도한 통제 주의',
      description:
        '관성의 에너지가 지나치게 강하면 관계에서 규칙과 통제가 너무 강해질 수 있어. 상대방에게 기대치와 기준을 너무 엄격하게 적용하면 상대가 숨막혀 할 수 있거든. 때로는 기준을 내려놓고 흘러가는 대로 즐기는 연습이 필요해.',
    },
    tags: ['관성과다', '통제', '엄격함', '주의'],
  },
];
