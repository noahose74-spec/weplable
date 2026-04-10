/**
 * 에셋 및 리소스 교체 용이성 (Resource Replacement Structure)
 * 
 * 모든 더미 이미지 경로 및 유저 커스텀 이미지 경로는 이곳에서 관리합니다.
 * 하드코딩 방지를 위해 UI 컴포넌트에서는 ASSETS 상수를 불러와 사용합니다.
 */

export const ASSETS = {
  // 매치 3 블록 에셋
  BLOCKS: {
    RED: '/assets/blocks/red.png',
    BLUE: '/assets/blocks/blue.png',
    YELLOW: '/assets/blocks/yellow.png',
    GREEN: '/assets/blocks/green.png',
  },
  
  // 획득하는 수리용 일회용 아이템 (보상 인벤토리용)
  ITEMS: {
    BED: '/assets/items/item_bedding.png',
    SOFA: '/assets/items/item_sofa_leather.png',
    GRAMOPHONE: '/assets/items/item_gramophone_parts.png',
    WINDOW: '/assets/items/item_glass_pane.png',
  },
  
  // 아웃게임 인테리어 에셋 (지형지물)
  INTERIOR: {
    BACKGROUND: '/assets/interiors/background.png',
    FINAL_BACKGROUND: '/assets/interiors/background_repaired.png',
    
    // 망가진 상태 (수리 전)
    BROKEN: {
      BED: '/assets/interiors/broken_bed.png',
      SOFA: '/assets/interiors/broken_sofa.png',
      GRAMOPHONE: '/assets/interiors/broken_gramophone.png',
      WINDOW: '/assets/interiors/broken_window.png',
    },
    
    // 수리 완료된 상태 (성공 보상 아이템 매핑)
    REPAIRED: {
      BED: '/assets/interiors/repaired_bed.png',
      SOFA: '/assets/interiors/repaired_sofa.png',
      GRAMOPHONE: '/assets/interiors/repaired_gramophone.png',
      WINDOW: '/assets/interiors/repaired_window.png',
    }
  },
  
  // UI 에셋 (버튼, 패널, 모달창 등 각종 인터페이스 꾸미기용 리소스)
  UI: {
    // 💡 공통 요소
    BUTTON_PRIMARY: '/assets/ui/btn_primary.png',      // 일반 메인 버튼 (예: BED 퀘스트 버튼 등)
    BUTTON_DANGER: '/assets/ui/btn_danger.png',        // 경고/포기 버튼 (예: Give Up 버튼)
    MODAL_BG: '/assets/ui/modal_bg.png',               // 각종 팝업/경고창 배경 프레임
    
    // 💡 인게임 (Match3Engine) 
    HUD_TOP_BAR: '/assets/ui/hud_top.png',             // 상단 Moves / Target 정보창 배경
    BOARD_FRAME: '/assets/ui/board_frame.png',         // 매치3 퍼즐 판 테두리 액자
    
    // 💡 아웃게임 (LobbyView)
    INVENTORY_BAR: '/assets/ui/inventory_bar.png',     // 하단 인벤토리 슬롯 배경
  }
};
