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

// 주간 뷰 요소
const daysContainer = document.createElement('div');
daysContainer.id = 'days-container';
const prevWeekBtn = document.createElement('button');
prevWeekBtn.id = 'prev-week';
prevWeekBtn.textContent = '<';
const nextWeekBtn = document.createElement('button');
nextWeekBtn.id = 'next-week';
nextWeekBtn.textContent = '>';

// **직접 수정** 로컬 스토리지에 저장된 날짜 불러오기. 없으면 현재 날짜 사용
const savedDate = localStorage.getItem('lastDate');
let selectedDate = savedDate ? new Date(savedDate) : new Date();
let currentWeekStart = new Date(selectedDate);
currentWeekStart.setDate(selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1));

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

    // 주간 뷰 업데이트
    renderWeeklyView();
}

// 주간 뷰 렌더링
function renderWeeklyView() {
    const weeklyContainer = document.querySelector('.weekly-view');
    const daysContainer = document.getElementById('days-container');
    daysContainer.innerHTML = '';
    const tempDate = new Date(currentWeekStart);
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(tempDate);
        date.setDate(tempDate.getDate() + i);

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        if (formatDate(date) === formatDate(selectedDate)) dayCard.classList.add('selected');
        if (formatDate(date) === formatDate(new Date())) dayCard.classList.add('today');

        const dayName = document.createElement('span');
        dayName.className = 'day-name';
        dayName.textContent = dayNames[i];

        const dayDate = document.createElement('span');
        dayDate.textContent = date.getDate();

        // 해당 날짜의 Todo 개수 계산
        const cnt = getTodoCountByDate(date);
        const todoCnt = document.createElement('span');
        todoCnt.className = 'todo-cnt';
        todoCnt.textContent = cnt;

        dayCard.appendChild(dayName);
        dayCard.appendChild(dayDate);
        dayCard.appendChild(todoCnt);

        dayCard.onclick = () => {
            selectedDate = new Date(date);
            localStorage.setItem('lastDate', selectedDate);
            updateDateDisplay();
            applyFilter();
        };

        daysContainer.appendChild(dayCard);
    }
}

// 날짜별 할 일 개수 구하기
function getTodoCountByDate(date) {
    const dateStr = formatDate(date);
    const saved = localStorage.getItem('todos');
    if (!saved) return 0;
    const todos = JSON.parse(saved);
    return todos.filter(t => t.date === dateStr).length;
}

// 날짜 이동 이벤트 리스너
prevDateBtn.addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() - 1);

    // **직접 수정** 변경된 날짜 저장
    localStorage.setItem('lastDate', selectedDate);

    updateDateDisplay();
    applyFilter();
});

nextDateBtn.addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() + 1);

    // **직접 수정** 변경된 날짜 저장
    localStorage.setItem('lastDate', selectedDate);

    updateDateDisplay();
    applyFilter();
});

// 주간 이동 이벤트 리스너
document.getElementById('prev-week').addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeeklyView();
});

document.getElementById('next-week').addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeeklyView();
});
// 초기 날짜 표시
updateDateDisplay();


// **직접 수정** 삭제 시 필터 별 개수 반영이 안되는 문제를 해결하기 위해 applyFilter 함수 밖으로 분리함
function filterCnt(){
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
}

// 현재 필터 상태에 따라 Todo 목록을 필터링하는 함수
function applyFilter() {

    // **직접 수정** filterCnt라는 함수로 밖으로 분리함
    filterCnt();    

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

function saveTodos() {
    const todos = [];
    const lis = todoList.querySelectorAll('li');
    lis.forEach(li => {
        todos.push({
            task: li.querySelector('.todo-text').textContent,
            completed: li.classList.contains('completed'),
            date: li.dataset.date
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoElement(task, isCompleted = false, date = formatDate(selectedDate)) {
    const li = document.createElement('li');
    li.dataset.date = date;
    if (isCompleted) li.classList.add('completed');
    
    // 할 일 텍스트 요소
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = task;
    // 텍스트 클릭 시에도 완료 처리
    span.onclick = () => {
        li.classList.toggle('completed');
        applyFilter();
        saveTodos();
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
        saveTodos();
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
            saveTodos();
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
            saveTodos();
            // **직접 수정** 삭제 시에도 개수를 반영하기 위해 분리시킨 함수 실행
            filterCnt();
        });
    };
    actionBtns.appendChild(deleteButton);

    li.appendChild(actionBtns);

    // **직접 수정** li에 todo 클래스를 추가하여 opacity 값이 0인 투명한 상태로 설정
    li.classList.add("todo");

    // **직접 수정** li에 fade 클래스를 추가하여 opacity를 1로 바꾸면서 천천히 보이게 설정. setTimeout을 사용하여 DOM에 li 요소 추가 후 실행할 수 있도록 미세한 딜레이 넣음
    setTimeout(()=>{
        li.classList.add("fade");
    })
    
    return li;
}

function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (!saved) return;
    const todos = JSON.parse(saved);
    todos.forEach(todo => {
        const li = createTodoElement(todo.task, todo.completed, todo.date);
        todoList.appendChild(li);
    });
    applyFilter();
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
    const li = createTodoElement(task);
    todoList.appendChild(li);
    
    // 신규 할 일 추가 시에도 현재 필터 적용
    applyFilter();
    saveTodos();
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

loadTodos();
