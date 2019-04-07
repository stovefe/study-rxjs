const { fromEvent } = rxjs;
const { map, switchMap, takeUntil, take, first } = rxjs.operators;

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
            map(move => move - start), takeUntil(end$)
        );
    })
);

drag$.subscribe(distance => console.log("start$와 move$의 차이값 ", distance));

const drop$ = drag$.pipe(
    switchMap(drag => end$.pipe(first()))   //take 를 적용하여 한번 발생했을때 end$데이터 발생을 중지하도록
);