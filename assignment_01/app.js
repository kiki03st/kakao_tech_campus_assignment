// Todo 앱 기능 구현
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const errorMessage = document.getElementById('error-message');
const todoList = document.getElementById('todo-list');

// 할 일 추가 함수
function addTodo(task) {
    const li = document.createElement('li');
    
    // 할 일 텍스트 요소
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = task;
    // 텍스트 클릭 시에도 완료 처리
    span.onclick = () => li.classList.toggle('completed');
    li.appendChild(span);

    // 버튼 컨테이너
    const actionBtns = document.createElement('div');
    actionBtns.className = 'action-btns';

    // 완료 버튼
    const completeButton = document.createElement('button');
    completeButton.textContent = '완료';
    completeButton.className = 'btn complete-btn';
    completeButton.onclick = () => li.classList.toggle('completed');
    actionBtns.appendChild(completeButton);

    // 수정 버튼
    const editButton = document.createElement('button');
    editButton.textContent = '수정';
    editButton.className = 'btn edit-btn';
    editButton.onclick = () => {
        const newText = prompt('할 일 수정:', span.textContent);
        if (newText !== null && newText.trim() !== '') {
            span.textContent = newText;
        }
    };
    actionBtns.appendChild(editButton);

    // 삭제 버튼
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.className = 'btn delete-btn';
    deleteButton.onclick = () => {
        // **직접 수정** li에서 fade 태그 제거
        li.classList.remove("fade");
        // **직접 수정** li에서 fade 태그를 제거하는 transition 시간에 맞춰서 EventListener 활용. fade 태그가 없어진 후, remove 작동하도록 설정
        li.addEventListener("transitionend", ()=>{
            li.remove();
        });
    };
    actionBtns.appendChild(deleteButton);

    li.appendChild(actionBtns);

    // **직접 수정** li에 todo 클래스를 추가하여 opacity 값이 0인 투명한 상태로 설정
    li.classList.add("todo");

    todoList.appendChild(li);

    // **직접 수정** li에 fade 클래스를 추가하여 opacity를 1로 바꾸면서 천천히 보이게 설정. setTimeout을 사용하여 DOM에 li 요소 추가 후 실행할 수 있도록 미세한 딜레이 넣음
    setTimeout(()=>{
        li.classList.add("fade");
    })
}

// 폼 제출 이벤트 핸들러
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    const task = todoInput.value.trim();
    
    if (task === '') {
        errorMessage.classList.remove('hidden'); // 에러 메시지 표시
    } else {
        errorMessage.classList.add('hidden'); // 에러 메시지 숨김
        addTodo(task);
        todoInput.value = ''; // 입력창 초기화
    }
});
