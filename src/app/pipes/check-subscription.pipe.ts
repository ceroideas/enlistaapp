import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkSubscription'
})
export class CheckSubscriptionPipe implements PipeTransform {

  transform(e: any, id: any) {

    let subs = e.subscriptions;

    if (subs.find(x=>x.user_id == id)) {
      return true;
    }else{
      return false;
    }
  }

}
