import * as React from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import * as _ from 'lodash';

import { TrafficService } from '../services/traffic';
import { networkTraffic } from '../../sample/networkTraffic';

export class D3DemoNetwork extends React.Component<any, any> {
	nodes: any[] = [];
	links: any[] = [];
	hits: any[] = [];
	simulation: any = {};
	width: number = 0;
	height: number = 0;
	svg: any = {};
	g: any = {};
	link: any = {};
	node: any = {};
	trafficService: any = {};
	requests: any[] = [];
	isActive: boolean = true;
	intervalId: number = 0;
	c10 = d3.scaleOrdinal(d3.schemeCategory10);

	constructor(props: any) {
		super(props);

		this.width = window.innerWidth;
		this.height = window.innerHeight;
	}

	scaleFactor(): any {
		if (this.width > this.height) {
			return this.height;
		}
		return this.width;
	}

	componentWillMount() {
		// Create force simulation
		this.simulation = d3.forceSimulation()
		// apply collision with padding
			.force('collide', d3.forceCollide((d: any) => {
				if (d.type === 'az') {
					return this.scaleFactor() / 5;
				}
			}))
			.force('x', d3.forceX(this.width / 2).strength(.185))
			.force('y', d3.forceY(this.height / 2).strength(.185))
			.force('link', d3.forceLink()
				.id((d: any) => {
					return d.id;
				})
				.strength((d: any) => {
					if (d.linkType === 'nn')
						return 0.1;
					else if (d.linkType === 'azn')
						return 3;
					else
						return 1;
				})
			)
			.force('charge', d3.forceManyBody().strength((d: any) => {
				if (d.type === 'az') {
					return -12000;
				} else if (d.type === 'node') {
					return -40;
				}
			}))
			.force('center', d3.forceCenter(this.width / 2, this.height / 2));
	}

	render() {
		return (
			<div>
				<Link to='/d3_demo_app' style={{paddingLeft: 20, paddingTop: 20}}>Application Traffic</Link>
				&nbsp;|&nbsp;<span className='is-active'> Network Traffic</span>

				<div id='chart'>
					<div className='svg-container'>
						<svg className='svg-content-responsive' preserveAspectRatio='xMinYMin meet' width={this.width}
						     height={this.height}>
						</svg>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.svg = d3.select("svg");
		this.g = this.svg.append("g");
		this.link = this.g.append("g").selectAll(".link");
		this.node = this.g.append("g").selectAll(".node");
		this.trafficService = new TrafficService(this.svg, this.width);

		const drawGraph = () => {
			this.node = this.node.data(this.nodes, (d: any) => {
				return d.name;
			});
			this.node.exit().remove();

			// Create g tag for node
			const nodeEnter = this.node.enter()
				.append('g').attr('class', (d: any) => {
					return 'node  node' + d.index;
				});

			// append centre circle
			nodeEnter
				.filter((d: any) => {
					return d.type === 'az';
				}).append('circle')
				.attr('class', (d: any) => {
					return 'az-center node' + d.index;
				})
				.attr('r', this.scaleFactor() / 200);

			// append az zone circle
			nodeEnter
				.filter((d: any) => {
					return d.type === 'az';
				})
				.append('circle')
				.attr('class', 'az')
				.attr('r', this.scaleFactor() / 5.5);

			// append node circle
			nodeEnter
				.filter((d: any) => {
					return d.type === 'node';
				}).append('circle')
				.attr('class', (d: any) => {
					return 'node' + d.index;
				})
				.attr('r', this.scaleFactor() / 130)
				.style('stroke', (d: any) => {
					return d3.rgb(this.c10(d.group));
				});
			// for tooltip
			// .on('mouseover', this.showDetail)
			// .on('mouseout', this.hideDetail);

			//for interaction
			nodeEnter.call(d3.drag()
				.on('start', dragstarted)
				.on('drag', dragged)
				.on('end', dragended));

			//append text to g
			nodeEnter.append('text')
				.attr('dx', this.scaleFactor() / 130 + 3)
				.attr('dy', '.25em')
				.attr('class', (d: any) => {
					if (d.type === 'az') {
						return 'label az'
					}
					return 'label';
				})
				.text((d: any) => {
					return d.name;
				});
			this.node = nodeEnter.merge(this.node);

			this.link = this.link.data(this.links, (d: any) => {
				return 'node' + d.source.index + '-node' + d.target.index;
			});
			this.link.exit().remove();
			this.link = this.link.enter()
				.insert('line', '.node')
				.attr('class', (d: any) => {
					if (d.linkType === 'az' || d.linkType === 'azn') {
						return 'link light node' + d.source.index + '-node' + d.target.index;
					}
					return 'link node' + d.source.index + '-node' + d.target.index;
				}).merge(this.link);

			this.simulation
				.nodes(this.nodes)
				.on('tick', ticked);
			this.simulation
				.force('link')
				.links(this.links);
			this.simulation.alpha(0.1).restart();
		};

		const ticked = () => {
			this.link
				.attr('x1', (d: any) => {
					return d.source.x;
				})
				.attr('y1', (d: any) => {
					return d.source.y;
				})
				.attr('x2', (d: any) => {
					return d.target.x;
				})
				.attr('y2', (d: any) => {
					return d.target.y;
				});
			this.node.attr('transform', (d: any) => {
				return 'translate(' + d.x + ',' + d.y + ')';
			});
		};

		const dragstarted = () => {
			if (!d3.event.active) {
				this.simulation.alphaTarget(0.3).restart();
			}
			d3.event.subject.fx = d3.event.subject.x;
			d3.event.subject.fy = d3.event.subject.y;
		};

		const dragged = () => {
			d3.event.subject.fx = d3.event.x;
			d3.event.subject.fy = d3.event.y;
		};

		const dragended = () => {
			if (!d3.event.active) {
				this.simulation.alphaTarget(0);
			}
			d3.event.subject.fx = null;
			d3.event.subject.fy = null;
		};

		const processData = () => {
			// process nodes data
			let addedSomething = false;
			// process nodes data
			for (let i = 0; i < networkTraffic.nodes.length; i++) {
				let found = _.find(this.nodes, (node: any) => {
					return node.name === networkTraffic.nodes[i].name;
				});

				if (!found) {
					let node = networkTraffic.nodes[i];
					node.index = i;

					this.nodes.push(networkTraffic.nodes[i]);
					addedSomething = true;
				}
			}

			// process links data
			for (let i = 0; i < networkTraffic.links.length; i++) {
				let found = _.find(this.links, (link: any) => {
					return networkTraffic.links[i].source === link.source.name && networkTraffic.links[i].target === link.target.name;
				});

				if (!found) {
					this.links.push({
						linkType: networkTraffic.links[i].linkType,
						source: _.find(this.nodes, (n: any) => {
							return n.name === networkTraffic.links[i].source;
						}),
						target: _.find(this.nodes, (n: any) => {
							return n.name === networkTraffic.links[i].target;
						})
					});
					addedSomething = true;
				}
			}

			if (addedSomething) {
				drawGraph();
			}

			this.requests = this.trafficService.viewHits(this.nodes, networkTraffic.hits, this.isActive);
			this.trafficService.drawLegend(this.requests);
			this.trafficService.drawResponseTimes();
			this.trafficService.updateResponseTimes();
		};

		processData();

		this.intervalId = setInterval(function () {
			processData();
		}.bind(this), 5000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}
}