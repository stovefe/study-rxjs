const { fromEvent, merge, of, defer, animationFrameScheduler, interval, concat } = rxjs;
const { map, switchMap, takeUntil, reduce, share, scan, first, takeWhile, startWith, withLatestFrom } = rxjs.operators;

const THRESHOLD = 30;
const DEFAULT_DURATION = 300;

const $view = document.getElementById("carousel");
const $container = $view.querySelector(".container");
const PANEL_COUNT = $container.querySelectorAll(".panel").length;

const SUPPORT_TOUCH = "ontouchstart" in window;
const EVENTS = {
    start: SUPPORT_TOUCH ? "touchstart" : "mousedown",
    move: SUPPORT_TOUCH ? "touchmove" : "mousemove",
    end: SUPPORT_TOUCH ? "touchend" : "mouseup"
}

// fromEvent를 이용하여 $view에서 발생하는 이벤트들을 각각 Observable로 만듬
const start$ = fromEvent($view, EVENTS.start).pipe(toPos);
const move$ = fromEvent($view, EVENTS.move).pipe(toPos)
const end$ = fromEvent($view, EVENTS.endt);

function toPos(obs$) {
    // return SUPPORT_TOUCH ? event.changedTouches[0].pageX : event.pageX;
    return obs$.pipe(
        map(v => SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)
    );
}

function animation(from, to, duration) {
    return defer(() => {
        const scheduler = animationFrameScheduler;
        const start = scheduler.now();
        const interval$ = interval(0, scheduler).pipe(
            map(() => (scheduler.now() - start) / duration),
            takeWhile(rate => rate < 1)
        );
        return concat(interval$, of(1)).pipe(
            map(rate => from + (to - from) * rate)
        );
    });
}

function translateX(posX) {
    $container.style.transform = `translate3d(${posX}px, 0, 0)`;
}

// (1)map: start$의 데이터를 변경
const drag$ = start$.pipe(
    // map(start => move$.pipe( 
    //     takeUntil(end$) // (2) takeUntil: end$이 발생하면 move$ Observable을 중지
    // )),
    // mergeAll()  // (3) mergeAll: flat하게 Observable을 합치기

    // mergeMap(start => move$.ipe(takeUntil(end$)))   // (4) 위의 map + mergeAll -> mergeMap으로 변경

    // switchMap(start => move$.pipe(takeUntil(end$))) // (5) 기존 데이터를 자동 종료하기 위해 (4)를 switchMap으로 변경
    switchMap(start => {
        return move$.pipe(
            map(move => move - start),
            takeUntil(end$)
        );
    }),
    share(),
    map(distance => ({distance}))
);
// drag$.subscribe(distance => console.log("start$와 move$의 차이값 ", distance));


// let viewWidth = $view.clientWidth;
const size$ = fromEvent(window, "resize").pipe(
    startWith(0),   // 맨 초기 뷰 사이즈르 전달하기 위해 의미없는 값인 0을 전달함
    map(event => $view.clientWidth)
);
// size$.subscribe(width => console.log("view의 넓이", width));


const drop$ = drag$.pipe(
    switchMap(drag => {
        return end$.pipe(
            map(event => drag),
            first()    //take 를 적용하여 한번 발생했을때 end$데이터 발생을 중지하도록
        );   
    }),
    withLatestFrom(size$, (drag, size) => {
        return { ...drag, size };
    })
);
// drop$.subscribe(array => console.log("drop", array));

const carousel$ = merge(drag$, drop$).pipe(
    scan((store, {distance, size}) => {
        const updateStore = {
            from: -(store.index * store.size) + distance
        };

        if (size === undefined) {
            updateStore.to = updateStore.from;
        }
        else {
            let tobeIndex = store.index;
            if (Math.abs(distance) >= THRESHOLD) {
                tobeIndex = distance < 0 ? Math.min(tobeIndex + 1, PANEL_COUNT - 1) : Math.max(tobeIndex -1, 0);
            }
            updateStore.index = tobeIndex;
            updateStore.to = -(tobeIndex * size);
            updateStore.size = size;
        }
        return { ...store, ...updateStore };
    }, {
        from: 0,
        to: 0,
        index: 0,
        size: 0
    }),
    switchMap(({from, to}) => from === to ? of(to) : animation(from, to, DEFAULT_DURATION))
);

carousel$.subscribe(pos => {
    console.log("캐러셀 데이터", pos);
    translateX(pos);
});