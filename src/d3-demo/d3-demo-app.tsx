import { event } from 'd3';
import { drag } from 'd3-drag';
import { forceCenter, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { select } from 'd3-selection';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './d3-force.css';
import Gauge from './gauge';
import appTraffic from './mock/app-traffic.json';
import { TrafficService } from './traffic';

export class D3DemoApp extends React.Component<any, any> {
  nodes: any[] = [];
  links: any[] = [];
  hits: any[] = [];
  simulation: any = {};
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  svg: any = {};
  g: any = {};
  link: any = {};
  node: any = {};
  trafficService: any = {};
  requests: any[] = [];
  isActive = true;
  intervalId = 0;
  powerGauge: Gauge = null;

  constructor(props: any) {
    super(props);
    // Create force simulation
    this.simulation = forceSimulation()
      .force('x', forceX(this.width / 2).strength(0.185))
      .force('y', forceY(this.height / 2).strength(0.185))
      .force(
        'link',
        forceLink()
          .id((d: any) => {
            return d.id;
          })
          .distance((d: any) => {
            const numlinks = this.links.filter((link: any) => {
              return (
                link.source.name === d.source.name ||
                link.source.name === d.target.name ||
                link.target.name === d.target.name ||
                link.target.name === d.source.name
              );
            });
            return numlinks.length * 0.6 * (this.height / 130) + this.width / 300;
          })
          .strength(0.1)
      )
      .force(
        'charge',
        forceManyBody().strength((d: any) => {
          const numlinks = this.links.filter((link: any) => {
            return (
              link.source.name === d.name ||
              link.source.name === d.name ||
              link.target.name === d.name ||
              link.target.name === d.name
            );
          });
          return numlinks.length * -50 - 1000;
        })
      )
      .force('center', forceCenter(this.width / 2, this.height / 2));
  }

  getNode(name: string) {
    return this.nodes.find((node) => {
      return name === node.name;
    });
  }

  componentDidMount() {
    this.svg = select('svg.svg-content-responsive');
    this.g = this.svg.append('g');
    this.link = this.g.append('g').selectAll('.link');
    this.node = this.g.append('g').selectAll('.node');
    this.trafficService = new TrafficService(this.svg, this.width);

    // Initial gauge
    this.powerGauge = new Gauge(this.svg, {
      size: 150,
      clipWidth: 300,
      clipHeight: 300,
      ringWidth: 60,
      maxValue: 1000,
      transitionMs: 5000,
      x: 250,
      y: 10,
      title: 'Logs per second',
      titleDx: 36,
      titleDy: 90,
    });
    this.powerGauge.render(undefined);

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
      if (!event.active) {
        this.simulation.alphaTarget(0.3).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };

    const dragged = () => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragended = () => {
      if (!event.active) {
        this.simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    };

    const drawGraph = () => {
      // Apply the general update pattern to the nodes.
      this.node = this.node.data(this.nodes, (d: any) => {
        return d.name;
      });
      this.node.exit().remove();

      const nodeEnter = this.node.enter().append('g').attr('class', 'node');
      nodeEnter
        .append('circle')
        .attr('class', (d: any) => {
          return d.name + ' ' + d.priority;
        })
        .attr('r', this.width / 200)
        .call(drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));
      nodeEnter
        .append('text')
        .attr('dx', this.width / 130 + 3)
        .attr('dy', '.25em')
        .text((d: any) => {
          return d.shortName;
        });
      this.node = nodeEnter.merge(this.node);

      // Apply the general update pattern to the links.
      this.link = this.link.data(this.links, (d: any) => {
        return d.source.name + '-' + d.target.name;
      });
      this.link.exit().remove();
      this.link = this.link
        .enter()
        .insert('line', '.node')
        .attr('class', (d: any) => {
          return 'link ' + d.source.name + '-' + d.target.name;
        })
        .merge(this.link);

      this.simulation.nodes(this.nodes).on('tick', ticked);
      this.simulation.force('link').links(this.links);
      this.simulation.alpha(0.1).restart();
    };

    const processData = () => {
      this.powerGauge.update(Math.random() * 1000, undefined);

      // process nodes data
      let addedSomething = false;
      for (let i = 0; i < appTraffic.nodes.length; i++) {
        const nodeIndex = this.nodes.findIndex((node: any) => {
          return node.name === appTraffic.nodes[i].name;
        });
        if (nodeIndex < 0) {
          this.nodes.push(appTraffic.nodes[i]);
          addedSomething = true;
        }
      }
      // process links data
      for (let i = 0; i < appTraffic.links.length; i++) {
        let found = false;
        for (let k = 0; k < this.links.length; k++) {
          if (
            appTraffic.nodes[appTraffic.links[i].source].name === this.links[k].source.name &&
            appTraffic.nodes[appTraffic.links[i].target].name === this.links[k].target.name
          ) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.links.push({
            source: this.getNode(appTraffic.nodes[appTraffic.links[i].source].name),
            target: this.getNode(appTraffic.nodes[appTraffic.links[i].target].name),
          });
          addedSomething = true;
        }
      }

      if (addedSomething) {
        drawGraph();
      }

      this.requests = this.trafficService.viewHits(null, appTraffic.hits, this.isActive);
      this.trafficService.drawLegend(this.requests);
      this.trafficService.drawResponseTimes();
      this.trafficService.updateResponseTimes();
    };

    processData();

    this.intervalId = window.setInterval(() => processData(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const nodeLegendItems = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'UNKNOWN'];

    const renderNodeLegend = nodeLegendItems.map((nodeLegendItem: any, index: number) => (
      <g className='nodeLegend' key={nodeLegendItem}>
        <circle r={this.width / 200} className={nodeLegendItem} cx={this.width - 250} cy={index * 25 + 440} />
        <text dx={this.width - 230} dy={index * 25 + 444}>
          {nodeLegendItem}
        </text>
      </g>
    ));

    return (
      <div className='d3-force-content'>
        <span className='is-active nav-link'>Application Traffic</span>
        &nbsp;|&nbsp;<Link to='/d3_demo_network'>Network Traffic</Link>
        <div id='chart'>
          <div className='svg-container'>
            <svg
              className='svg-content-responsive'
              preserveAspectRatio='xMinYMin meet'
              width={this.width}
              height={this.height}>
              {renderNodeLegend}
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
