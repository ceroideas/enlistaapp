import { NgModule } from '@angular/core';
import { NormalizePipe } from './normalize.pipe';
import { SearchPipe } from './search.pipe';
import { DayPipe } from './day.pipe';
import { CheckSubscriptionPipe } from './check-subscription.pipe';

@NgModule({
	declarations: [NormalizePipe, SearchPipe, DayPipe, CheckSubscriptionPipe],
	imports: [],
	exports: [NormalizePipe, SearchPipe, DayPipe, CheckSubscriptionPipe]
})
export class PipesModule {}
