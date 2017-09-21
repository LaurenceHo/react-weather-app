import * as React from 'react';
import { Weather } from './Weather';

export const Main = () => {
	return (
		<div>
			<div className="row">
				<div>
					<Weather/>
				</div>
			</div>
		</div>
	);
};