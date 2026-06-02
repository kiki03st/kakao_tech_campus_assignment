// Todo 앱 기능 구현
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const errorMessage = document.getElementById('error-message');
const todoList = document.getElementById('todo-list');

// 필터 버튼 요소
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');
let currentFilter = 'all';

// 날짜 관리 변수
const dateDisplay = document.getElementById('current-date-display');
const prevDateBtn = document.getElementById('prev-date');
const nextDateBtn = document.getElementById('next-date');
let selectedDate = new Date();

// 날짜를 YYYY-MM-DD 형식의 문자열로 변환하는 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 화면의 날짜 표시를 업데이트하는 함수
function updateDateDisplay() {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateDisplay.textContent = selectedDate.toLocaleDateString('ko-KR', options);
}

// 날짜 이동 이벤트 리스너
prevDateBtn.addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() - 1);
    updateDateDisplay();
    applyFilter();
});

nextDateBtn.addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() + 1);
    updateDateDisplay();
    applyFilter();
});

// 초기 날짜 표시
updateDateDisplay();

// 현재 필터 상태에 따라 Todo 목록을 필터링하는 함수
function applyFilter() {

    // **직접 수정** 전체, 진행 중, 완료 필터 버튼 옆에 할 일 개수 표시
    var Allcnt = filterAll.querySelector('.filter-cnt');
    var Activecnt = filterActive.querySelector('.filter-cnt');
    var Completedcnt = filterCompleted.querySelector('.filter-cnt');
    Allcnt.textContent = 0;
    Activecnt.textContent = 0;
    Completedcnt.textContent = 0;
    
    // **직접 수정** 날짜 별 개수를 표시해야 하므로 todoList에서 날짜가 일치하는 요소들만 세어서 개수 표시
    for(var i = 0; i < todoList.children.length; i++){
        var li = todoList.children[i];
        if(li.dataset.date === formatDate(selectedDate)){
            Allcnt.textContent++;
            if(li.classList.contains('completed')) Completedcnt.textContent++;
            else Activecnt.textContent++;
        }
    }

    const todos = todoList.querySelectorAll('li');
    const targetDateStr = formatDate(selectedDate);

    todos.forEach(li => {
        const isCompleted = li.classList.contains('completed');
        const todoDate = li.dataset.date;
        
        // 날짜가 다르면 숨김
        if (todoDate !== targetDateStr) {
            li.classList.add('hidden');
            return;
        }

        // 현재 상태 필터 적용
        if (currentFilter === 'all') {
            li.classList.remove('hidden');
        } else if (currentFilter === 'active') {
            isCompleted ? li.classList.add('hidden') : li.classList.remove('hidden');
        } else if (currentFilter === 'completed') {
            isCompleted ? li.classList.remove('hidden') : li.classList.add('hidden');
        }
    });
}

// 필터 버튼 클릭 이벤트 설정
[filterAll, filterActive, filterCompleted].forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 모든 필터 버튼에서 active 클래스 제거 후 클릭된 버튼에 추가
        [filterAll, filterActive, filterCompleted].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 필터 상태 업데이트
        if (btn === filterAll) currentFilter = 'all';
        else if (btn === filterActive) currentFilter = 'active';
        else if (btn === filterCompleted) currentFilter = 'completed';
        
        applyFilter();
    });
});

// 할 일 추가 함수
function addTodo(task) {
    const li = document.createElement('li');
    // 현재 선택된 날짜 저장
    li.dataset.date = formatDate(selectedDate);
    
    // 할 일 텍스트 요소
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = task;
    // 텍스트 클릭 시에도 완료 처리
    span.onclick = () => {
        li.classList.toggle('completed');
        applyFilter();
    };
    li.appendChild(span);

    // 버튼 컨테이너
    const actionBtns = document.createElement('div');
    actionBtns.className = 'action-btns';

    // 완료 버튼
    const completeButton = document.createElement('button');
    completeButton.textContent = '완료';
    completeButton.className = 'btn complete-btn';
    completeButton.onclick = () => {
        li.classList.toggle('completed');
        applyFilter();
    };
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
    
    // 신규 할 일 추가 시에도 현재 필터 적용
    applyFilter();
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
