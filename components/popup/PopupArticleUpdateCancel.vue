<template>
  <div class="modal fade" id="cancelModal" tabindex="-1" role="dialog" aria-labelledby="cancelModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <!-- 타이틀 -->
        <div class="modal-body">
          수정했던 내용을 모두 잃습니다. 취소할까요?
        </div>

        <!-- 버튼   -->
        <div class="modal-footer justify-content-between">
          <button class="btn btn-outline-secondary btn-sm" data-dismiss="modal">닫기</button>
          <button @click="$parent.onCancel()" class="btn btn-outline-primary btn-sm" data-dismiss="modal">확인</button>
        </div>
      </div>
    </div>
  </div>   
</template>