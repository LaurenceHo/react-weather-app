import React from 'react';
import { Weather } from './Weather';

export const Main = () => {
	return (
		<div>
			<div className="row">
				<div className="columns medium-6 large-4 small-centered">
					<Weather/>
				</div>
			</div>
		</div>
	);
};