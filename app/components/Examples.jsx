import React from 'react';
import { NavLink } from 'react-router-dom';

export const Examples = () => {
	return (
		<div>
			<h1 className="text-center">Examples</h1>
			<p>Here are a few example locations to try out:</p>
			<ol>
				<li>
					<NavLink to='/?location=Philadelphia'>Philadelphia, PA</NavLink>
				</li>
				<li>
					<NavLink to='/?location=Rio'>Rio, Brazil</NavLink>
				</li>
			</ol>
		</div>

	)
};