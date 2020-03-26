import { event, rgb, schemeCategory10 } from 'd3';
import { drag } from 'd3-drag';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { find } from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ToolTipType } from '../constants/types';
import './d3-force.css';
import Gauge from './gauge';
import networkTraffic from './mock/network-traffic.json';
import { ToolTip } from './tool-tip';
import { TrafficService } from './traffic';

interface D3DemoNetworkState {
  tooltip: ToolTipType;
}

export class D3DemoNetwork extends React.Component<any, D3DemoNetworkState> {
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
  c10 = scaleOrdinal(schemeCategory10);
  powerGauge: Gauge = null;

  tooltip: ToolTipType = {
    display: false,
    data: {
      key: '',
      group: '',
    },
    type: 'network',
  };

  state = {
    tooltip: this.tooltip,
  };

  constructor(props: any) {
    super(props);
    // Create force simulation
    this.simulation = forceSimulation()
      // apply collision with padding
      .force(
        'collide',
        forceCollide((d: any) => {
          if (d.type === 'az') {
            return this.scaleFactor() / 5;
          }
        })
      )
      .force('x', forceX(this.width / 2).strength(0.185))
      .force('y', forceY(this.height / 2).strength(0.185))
      .force(
        'link',
        forceLink()
          .id((d: any) => {
            return d.id;
          })
          .strength((d: any) => {
            if (d.linkType === 'nn') {
              return 0.1;
            } else if (d.linkType === 'azn') {
              return 3;
            } else {
              return 1;
            }
          })
      )
      .force(
        'charge',
        forceManyBody().strength((d: any) => {
          if (d.type === 'az') {
            return -12000;
          } else if (d.type === 'node') {
            return -40;
          }
        })
      )
      .force('center', forceCenter(this.width / 2, this.height / 2));
  }

  showToolTip = (e: any) => {
    this.setState({
      tooltip: {
        display: true,
        data: {
          key: e.name,
          group: e.group,
        },
        pos: {
          x: e.x,
          y: e.y,
        },
        type: 'network',
      },
    });
  };

  hideToolTip = () => {
    this.setState({
      tooltip: {
        display: false,
        data: {
          key: '',
          group: '',
        },
        type: 'network',
      },
    });
  };

  scaleFactor(): any {
    if (this.width > this.height) {
      return this.height;
    }
    return this.width;
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
      this.node = this.node.data(this.nodes, (d: any) => {
        return d.name;
      });
      this.node.exit().remove();

      // Create g tag for node
      const nodeEnter = this.node
        .enter()
        .append('g')
        .attr('class', (d: any) => {
          return 'node  node' + d.index;
        });

      // append centre circle
      nodeEnter
        .filter((d: any) => {
          return d.type === 'az';
        })
        .append('circle')
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
        })
        .append('circle')
        .attr('class', (d: any) => {
          return 'node' + d.index;
        })
        .attr('r', this.scaleFactor() / 130)
        .style('stroke', (d: any) => {
          return rgb(this.c10(d.group));
        })
        // for tooltip
        .on('mouseover', this.showToolTip)
        .on('mouseout', this.hideToolTip);

      // for interaction
      nodeEnter.call(drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

      // append text to g
      nodeEnter
        .append('text')
        .attr('dx', this.scaleFactor() / 130 + 3)
        .attr('dy', '.25em')
        .attr('class', (d: any) => {
          if (d.type === 'az') {
            return 'label az';
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
      this.link = this.link
        .enter()
        .insert('line', '.node')
        .attr('class', (d: any) => {
          if (d.linkType === 'az' || d.linkType === 'azn') {
            return 'link light node' + d.source.index + '-node' + d.target.index;
          }
          return 'link node' + d.source.index + '-node' + d.target.index;
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
      // process nodes data
      for (let i = 0; i < networkTraffic.nodes.length; i++) {
        const found = find(this.nodes, (node: any) => {
          return node.name === networkTraffic.nodes[i].name;
        });

        if (!found) {
          const node = networkTraffic.nodes[i];
          node.index = i;

          this.nodes.push(networkTraffic.nodes[i]);
          addedSomething = true;
        }
      }

      // process links data
      for (let i = 0; i < networkTraffic.links.length; i++) {
        const found = find(this.links, (link: any) => {
          return (
            networkTraffic.links[i].source === link.source.name && networkTraffic.links[i].target === link.target.name
          );
        });

        if (!found) {
          this.links.push({
            linkType: networkTraffic.links[i].linkType,
            source: find(this.nodes, (n: any) => {
              return n.name === networkTraffic.links[i].source;
            }),
            target: find(this.nodes, (n: any) => {
              return n.name === networkTraffic.links[i].target;
            }),
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

    this.intervalId = window.setInterval(() => processData(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div className='d3-force-content'>
        <Link to='/d3_demo_app' className='nav-link'>
          Application Traffic
        </Link>
        &nbsp;|&nbsp;<span className='is-active'> Network Traffic</span>
        <div id='chart'>
          <div className='svg-container'>
            <svg
              className='svg-content-responsive'
              preserveAspectRatio='xMinYMin meet'
              width={this.width}
              height={this.height}>
              <ToolTip tooltip={this.state.tooltip} />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
