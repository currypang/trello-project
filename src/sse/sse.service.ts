import { Injectable } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private users$: Subject<any> = new Subject();

  private observer = this.users$.asObservable();

  // 이벤트 발생 함수
  emitCardChangeEvent(userId: number, data) {
    // next를 통해 이벤트를 생성
    this.users$.next({ id: userId, data });
  }

  // 이벤트 연결
  sendClientAlarm(userId: number): Observable<any> {
    // 이벤트 발생시 처리 로직
    return this.observer.pipe(
      // 유저 필터링
      filter((user) => user.id === userId),
      // 데이터 전송
      map((user) => {
        return {
          data: {
            message: user,
          },
        } as MessageEvent;
      })
    );
  }
}
