import * as d3 from 'd3';

export interface Config {
	[key: string]: any
}

export const gauge = (container: any, configuration: any) => {
	let that = {
		configure: {},
		isRendered: {},
		render: {},
		update: {}
	};

	let config: Config = {
		size: 200,
		clipWidth: 200,
		clipHeight: 110,
		ringInset: 20,
		ringWidth: 20,

		pointerWidth: 10,
		pointerTailLength: 5,
		pointerHeadLengthPercent: 0.9,

		minValue: 0,
		maxValue: 10,

		minAngle: -90,
		maxAngle: 90,

		transitionMs: 750,

		majorTicks: 5,
		labelFormat: d3.format('d'),
		labelInset: 10,

		arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
	};

	let range: any = undefined;
	let r: any = undefined;
	let pointerHeadLength: any = undefined;

	let svg: any = undefined;
	let arc: any = undefined;
	let scale: any = undefined;
	let ticks: any = undefined;
	let tickData: any = undefined;
	let pointer: any = undefined;

	function deg2rad(deg: number) {
		return deg * Math.PI / 180;
	}

	function configure(configuration: any) {
		let prop = undefined;
		for ( prop in configuration ) {
			config[prop] = configuration[prop];
		}

		range = config.maxAngle - config.minAngle;
		r = config.size / 2;
		pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

		// a linear scale that maps domain values to a percent from 0..1
		scale = d3.scaleLinear()
			.range([0, 1])
			.domain([config.minValue, config.maxValue]);

		ticks = scale.ticks(config.majorTicks);
		tickData = d3.range(config.majorTicks).map(() => {
			return 1 / config.majorTicks;
		});

		arc = d3.arc()
			.innerRadius(r - config.ringWidth - config.ringInset)
			.outerRadius(r - config.ringInset)
			.startAngle((d: any, i: number) => {
				let ratio = d * i;
				return deg2rad(config.minAngle + (ratio * range));
			})
			.endAngle((d: any, i: number) => {
				let ratio = d * (i + 1);
				return deg2rad(config.minAngle + (ratio * range));
			});
	}

	that.configure = configure;

	function centerTranslation() {
		return 'translate(' + r + ',' + r + ')';
	}

	function isRendered() {
		return (svg !== undefined);
	}

	that.isRendered = isRendered;

	function render(newValue: any) {
		svg = d3.select(container)
			.append('svg:svg')
			.attr('class', 'gauge')
			.attr('width', config.clipWidth)
			.attr('height', config.clipHeight)
			.attr('x', config.x)
			.attr('y', config.y);

		svg.append('text')
			.text(config.title)
			.attr('dx', config.titleDx)
			.attr('dy', config.titleDy)
			.attr('class', config.class);

		let centerTx = centerTranslation();

		let arcs = svg.append('g')
			.attr('class', 'arc')
			.attr('transform', centerTx);

		arcs.selectAll('path')
			.data(tickData)
			.enter().append('path')
			.attr('fill', (d: any, i: number) => {
				return config.arcColorFn(d * i);
			})
			.attr('d', arc);

		let lg = svg.append('g')
			.attr('class', 'label')
			.attr('transform', centerTx);
		lg.selectAll('text')
			.data(ticks)
			.enter().append('text')
			.attr('transform', (d: any) => {
				let ratio = scale(d);
				let newAngle = config.minAngle + (ratio * range);
				return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
			})
			.text(config.labelFormat);

		let lineData = [[config.pointerWidth / 2, 0],
			[0, -pointerHeadLength],
			[-(config.pointerWidth / 2), 0],
			[0, config.pointerTailLength],
			[config.pointerWidth / 2, 0]];
		let pointerLine = d3.line().curve(d3.curveLinear);
		let pg = svg.append('g').data([lineData])
			.attr('class', 'pointer')
			.attr('transform', centerTx);

		pointer = pg.append('path')
			.attr('d', pointerLine)
			.attr('transform', 'rotate(' + config.minAngle + ')');

		update(newValue === undefined ? 0 : newValue, undefined);
	}

	that.render = render;

	function update(newValue: any, newConfiguration: any) {
		if (newConfiguration !== undefined) {
			configure(newConfiguration);
		}
		let ratio = scale(newValue);
		let newAngle = config.minAngle + (ratio * range);
		pointer.transition()
			.duration(config.transitionMs)
			.ease(d3.easeElastic)
			.attr('transform', 'rotate(' + newAngle + ')');
	}

	that.update = update;

	configure(configuration);

	return that;
};
