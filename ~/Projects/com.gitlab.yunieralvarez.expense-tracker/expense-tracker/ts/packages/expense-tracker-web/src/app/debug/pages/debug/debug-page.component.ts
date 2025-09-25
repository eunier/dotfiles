import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DebugComponent } from '../../components/debug/debug/debug.component';

@Component({
	selector: 'app-debug-page',
	imports: [DebugComponent],
	templateUrl: './debug-page.component.html',
	styleUrl: './debug-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugPageComponent {}
