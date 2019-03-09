import {Observable, of, range, fromEvent, from, interval, empty, throwError, NEVER} from 'rxjs';
import {map, filter} from 'rxjs/operators';

/***
 * 1.1 Observable 생성자를 이용하여 Observable만들기
 */
// const numbers$ = Observable.create(observer => {
//     observer.next(1);
//     observer.next(2);
//     observer.next(3);
// });
// numbers$.subscribe(console.log);

/***
 * 1.2 Observable 구현 시 고려해야 할 것들
 */
/***
 * 1.2.1 에러 발생
 */
// const numbers$ = new Observable(observer => {
//     try {
//         observer.next(1);
//         observer.next(2);
//         throw new Error('에러 발생');
//         observer.next(3);
//     } catch(e) {
//         observer.error(e);
//     }
//
// });
// numbers$.subscribe({
//     next: console.log,
//     error: console.error
// });

/***
 * 1.2.2 데이터 전달이 완료된 경우
 */
// const numbers$ = new Observable(observer => {
//     try {
//         observer.next(1);
//         observer.next(2);
//         observer.next(3);
//         observer.complete('완료');                    // (1) 호출시 전달인자를 보내도 complete 구독내 메서드에서
//         observer.next(4);                           // (2) complete이후에는 구독이 끊키기 때문에 next호출해도 더이상 전달하지 않음.
//     } catch(e) {
//         observer.error(e);
//     }
//
// });
// numbers$.subscribe({
//     next: console.log,
//     error: console.error,
//     complete: result => console.log(`데이터 전달 ${result}`)     // (1) 파라미터에 값이 들어오지 않음
// });

/***
 * 1.2.3 구독 해제
 */
// const interval$ = new Observable(observer => {
//     const id = setInterval(() => {
//         observer.next(new Date().toString());
//     }, 1000);
//     return () => {
//         console.log('interval 제거');
//         clearInterval(id);
//     }
// });
// const subscription = interval$.subscribe({
//     next: console.log,
//     error: console.error,
// });
//
// setTimeout(() => {
//     subscription.unsubscribe();
// }, 5000);

/***
 * 1.3 rxjs 네임스페이스에 있는 생성 함수로 Observable 만들기
 */
/***
 * 1.3.1 of
 */
// of(10, 20, 30).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * 1.3.2 range
 */
// range(1, 10).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * 1.3.3.fromEvent
 */
// const click$ = fromEvent(document, 'click');
// const subscription = click$.subscribe({
//     next: v => console.log('click 이벤트 발생'),
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * 1.3.4 from
 */
/***
 * Array, Array-Like
 */
// from([10, 20, 30]).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });
//
// (function () {
//     return from(arguments);
// })(1, 2, 3).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * Map, Set, String (Iterable)
 */
// from(new Map([[1, 2], [2, 4], [4, 8]])).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * Promise
 */
// from(Promise.resolve(100)).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });
// from(Promise.reject('에러')).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * 1.3.5 Interval
 */
// interval(1000).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/**
 * 1.4 특별한 용도의 Observable 만들기
 */
/***
 * 1.4.1 empty
 */
// Observable.create(observer => {
//     observer.complete();
// });
// of(1, -2, 3).pipe(map(number => number < 0 ? empty() : number)).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * 1.4.2 throwError
 */
// const error = 'error'; //전달된 ERROR 데이터
// Observable.create(observer => {
//     observer.error(new Error(error));
// });
// of(1, -2, 3).pipe(map(number => number < 0 ? throwError('number는 0보다 커야한다') : number)).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });

/***
 * 1.4.3 never
 */
// Observable.create(observer => {
// });
// of(1, -2, 3).pipe(map(number => number < 0 ? NEVER : number)).subscribe({
//     next: console.log,
//     error: console.error,
//     complete: () => console.log('완료')
// });