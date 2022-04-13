import { NgModule } from '@angular/core';
import { NormalizePipe } from './normalize.pipe';
import { SearchPipe } from './search.pipe';
import { DayPipe } from './day.pipe';

@NgModule({
	declarations: [NormalizePipe, SearchPipe, DayPipe],
	imports: [],
	exports: [NormalizePipe, SearchPipe, DayPipe]
})
export class PipesModule {}
