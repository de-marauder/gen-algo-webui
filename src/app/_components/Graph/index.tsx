'use client'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { DataPoint, DataPoints, GraphItemsKeys } from '@/app/(Dashboard)/dashboard/visualisation/_helpers';
import Loading from '@/app/(Dashboard)/dashboard/visualisation/loading';
import { Button } from '../Buttons/Buttons';
import { Blur } from '../utils/Blur';
import { Modal } from '../Modals/Modal';
import ContextStore from '../store/context';

export const LineChart: React.FC<{
  caption: string;
  xLabel: string;
  yLabel: string;
  outerSection: React.MutableRefObject<HTMLDivElement | null>;
  item: GraphItemsKeys;
  fetchData: (item: GraphItemsKeys) => Promise<{
    graph: DataPoints;
    error: null;
  } | {
    error: Error;
    graph: null;
  }>;
}> = ({ caption, xLabel, yLabel, outerSection, fetchData, item }) => {
  const { configId } = useContext(ContextStore)
  const [data, setData] = useState<DataPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(false);
  const [showIndividualGA, setShowIndividualGA] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const doReload = () => {
    setError('');
    setReload(true);
  };

  useEffect(() => {
    setReload(false);
    setError('');
    if (!configId || configId.length !== 24) {
      setLoading(false);
      return setError('No Config selected');
    }

    fetchData(item)
      .then(({ graph, error }) => {
        if (error) throw new Error(error.message);
        setData(graph);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, [fetchData, item, reload, configId]);

  const selectWidth = () => {
    const wrapperContainer = outerSection.current?.clientWidth ?? 0;
    if (wrapperContainer > 1000) {
      return wrapperContainer / 3;
    } else if (wrapperContainer > 500 && wrapperContainer <= 1000) {
      return wrapperContainer / 2;
    } else {
      return 500;
    }
  };

  const margin = useMemo(() => ({ top: 20, right: 50, bottom: 30, left: 40 }), []); // Increased right margin
  const width = selectWidth() - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current || !data?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = data.map((el) => el.x);
    const y = data.map((el) => el.y);

    // Add 10% padding to the right of x-axis
    const xMax = d3.max(x) ?? 0;
    const xPadding = (xMax - (d3.min(x) ?? 0)) * 0.1;
    const minx = d3.min(x) ?? 0;
    const xScale = d3.scaleLinear()
      .domain([minx - (minx / 10), xMax + xPadding]).nice()
      .range([0, width]);

    // Add 10% padding to the top and bottom of y-axis
    const yMin = d3.min(y) ?? 0;
    const yMax = d3.max(y) ?? 0;
    const yPadding = (yMax - yMin) * 0.1;

    const yScale = d3.scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding]).nice()
      .range([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', '#eee')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        verticalLine.style('display', null);
        horizontalLine.style('display', null);
      })
      .on('mouseout', () => {
        verticalLine.style('display', 'none');
        horizontalLine.style('display', 'none');
        tooltip.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event);
        verticalLine.attr('transform', `translate(${x},0)`);
        horizontalLine.attr('transform', `translate(0,${y})`);

        // Update tooltip
        const xValue = xScale.invert(x).toFixed(2);
        const yValue = yScale.invert(y).toFixed(2);
        tooltip.style('display', null);
        tooltipText.text(`x: ${xValue}, y: ${yValue}`);
        tooltip.attr('transform', `translate(${x + margin.left},${y + margin.top - 60})`);
      });

    // Add gridlines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .attr('color', 'grey')
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(() => ''));

    g.append('g')
      .attr('class', 'grid')
      .attr('color', 'grey')
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Create the line
    const line = d3.line<DataPoints[0]>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // Add the line path
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale));

    // Add tooltip
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    tooltip.append('rect')
      .attr('width', 145)
      .attr('height', 30)
      .attr('fill', 'black')
      .style('opacity', 0.8);

    const tooltipText = tooltip.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('fill', 'white');

    // Add cursor-following gridlines
    const verticalLine = g.append('line')
      .attr('class', 'cursor-line')
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', 'gray')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '5,5')
      .style('display', 'none');

    const horizontalLine = g.append('line')
      .attr('class', 'cursor-line')
      .attr('x1', 0)
      .attr('x2', width)
      .style('stroke', 'gray')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '5,5')
      .style('display', 'none');

    // Add data points
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', 'orange')
      .on('click', (event, d) => {
        setShowIndividualGA(true);
        setSelectedPoint(d);
      });

    g.selectAll('.dot')
      .on('mouseover', (event, d) => {
        tooltip.style('display', null);
        tooltipText.text(`x: ${(d as DataPoint).x}, y: ${(d as DataPoint).y}`);
        const [x, y] = d3.pointer(event);
        tooltip.attr('transform', `translate(${x},${y - 60})`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });

  }, [data, margin, width, height]);

  return (
    <div className='w-fit relative p-4 pl-8 hover:bg-grey-100'>
      <div className='relative w-fit ring-4 ring-inset ring-gray-700 rounded-xl'>
        <p className='absolute w-full text-center rotate-[-90deg] translate-x-[-52%] translate-y-[-100%] bottom-[40%]'>{yLabel}</p>
        {(loading && !reload) && <Loading />}
        {error && (
          <div className='p-4 grid place-items-center rounded-xl absolute top-0 left-0 bottom-0 right-0 bg-blue-800/10 backdrop-blur-3xl'>
            <center>
              <p className='text-red'>{error}</p>
              <Button type='lg' styles='px-8 text-xl' onClick={doReload}>Retry</Button>
            </center>
          </div>
        )}
        <Blur styles={''} />
        <svg
          ref={svgRef}
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        />
        <p className='text-center'>{xLabel}</p>
      </div>
      <figcaption className='mt-2 text-center text-xl'><strong>{caption}</strong></figcaption>
      {showIndividualGA && (
        <IndividualGAGraph
          setShowIndividualGA={setShowIndividualGA}
          showIndividualGA={showIndividualGA}
          datapoint={selectedPoint?.generations.map((d, id) => ({
            ...d,
            id: id + 1
          })) || null}
        />
      )}
    </div>
  );
};

const IndividualGAGraph = ({
  setShowIndividualGA,
  showIndividualGA,
  datapoint
}: {
  setShowIndividualGA: React.Dispatch<React.SetStateAction<boolean>>;
  showIndividualGA: boolean;
  datapoint: DataPoint['generations'] | null
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const margin = useMemo(() => ({ top: 20, right: 30, bottom: 30, left: 40 }), []);

  useEffect(() => {
    if (!svgRef.current || !datapoint) return;

    const updateDimensions = () => {
      const svgElement = svgRef.current;
      if (svgElement) {
        const { width, height } = svgElement.getBoundingClientRect();
        setDimensions({
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [margin, datapoint]);

  useEffect(() => {
    if (!svgRef.current || !datapoint || dimensions.width === 0) return;

    const x = datapoint.map((el) => el.id);
    const y = datapoint.map((el) => el.hydrogen);

    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const minx = Math.min(...x);
    const maxx = Math.max(...x);
    const xScale = d3.scaleLinear()
      .domain([minx - (minx / 10), maxx + (maxx / 10)])
      .nice()
      .range([0, dimensions.width]);

    const miny = Math.min(...y);
    const maxy = Math.max(...y);
    const yScale = d3.scaleLinear()
      .domain([miny - (miny / 10), maxy + (maxy / 10)])
      .nice()
      .range([dimensions.height, 0]);

    // Add gridlines for both x and y axes
    chart.append('g')
      .attr('class', 'grid')
      .attr('color', 'grey')
      .attr('transform', `translate(0,${dimensions.height})`)
      .call(d3.axisBottom(xScale)
        .ticks(20)
        .tickSize(-dimensions.height)
        .tickFormat(() => '')
      );

    chart.append('g')
      .attr('class', 'grid')
      .attr('color', 'grey')
      .call(d3.axisLeft(yScale)
        .ticks(20)
        .tickSize(-dimensions.width)
        .tickFormat(() => '')
      );

    // Create the line generator
    const line = d3.line<DataPoint['generations'][0]>()
      .x((d) => xScale(d.id))
      .y((d) => yScale(d.hydrogen));

    // Create the x-axis
    chart.append('g')
      .attr('transform', `translate(0,${dimensions.height})`)
      .call(d3.axisBottom(xScale));

    // Create the y-axis
    chart.append('g')
      .call(d3.axisLeft(yScale));

    // Render the line
    chart.append('path')
      .datum(datapoint)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .transition()
      .attr('d', line)
      .call((path) => path.transition()
        .duration(3000)
        .attrTween('stroke-dasharray', () => {
          const length = path.node()?.getTotalLength();
          return d3.interpolate(`0,${length}`, `${length},${length}`);
        })
      );

    // Initialize horizontal and vertical lines, initially hidden
    const horizontalLine = chart.append('line')
      .attr('class', 'horizontal-line')
      .style('stroke', 'gray')
      .style('stroke-dasharray', '3, 3')
      .attr('x1', 0)
      .attr('x2', dimensions.width)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('opacity', 0);

    const verticalLine = chart.append('line')
      .attr('class', 'vertical-line')
      .style('stroke', 'gray')
      .style('stroke-dasharray', '3, 3')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', dimensions.height)
      .style('opacity', 0);

    // Add a transparent overlay to capture mouse events
    chart.append('rect')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        horizontalLine.style('opacity', 1);
        verticalLine.style('opacity', 1);
      })
      .on('mousemove', (event) => {
        const [mouseX, mouseY] = d3.pointer(event);
        horizontalLine.attr('y1', mouseY).attr('y2', mouseY);
        verticalLine.attr('x1', mouseX).attr('x2', mouseX);
      })
      .on('mouseout', () => {
        horizontalLine.style('opacity', 0);
        verticalLine.style('opacity', 0);
      });

    // Add a hover effect
    chart.selectAll('.dot')
      .data(datapoint)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.id))
      .attr('cy', (d) => yScale(d.hydrogen))
      .attr('r', 4)
      .attr('fill', 'orange')
      .on('mouseover', (event, d) => {
        const [mouseX, mouseY] = d3.pointer(event);
        tooltipBackground
          .attr('fill', 'black')
          .attr('width', '120')
          .attr('height', '50')
          .attr('x', mouseX - 60)
          .attr('y', mouseY - 60);

        tooltipTextX
          .attr('x', mouseX - 50)
          .attr('y', mouseY - 40)
          .text(`x = ${d.id}`)
        tooltipTextY
          .attr('x', mouseX - 50)
          .attr('y', mouseY - 20)
          .text(`y = ${d.hydrogen.toFixed(2)}`)
      })
      .on('mouseout', () => {
        tooltipBackground.attr('fill', 'none')
        tooltipTextX.text('')
        tooltipTextY.text('')
      });

    // tooltip for data point
    const tooltipBackground = chart.append('rect');
    const tooltipTextX = chart.append('text').attr('fill', 'white');
    const tooltipTextY = chart.append('text').attr('fill', 'white');

  }, [datapoint, dimensions, margin]);

  return (
    <Modal style={{
      width: '80vw',
      maxWidth: '80vw',
      height: '80vh',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#24365b'
    }} toggle={() => { setShowIndividualGA(!showIndividualGA) }}>
      <div style={{
        width: '100%',
        height: '100%',
        padding: '40px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        <h1 style={{ textAlign: 'center', margin: 'auto', marginBottom: '20px' }}>Plot of Hydrogen yield vs No. of Generations</h1>
        <div style={{
          color: 'black',
          width: '100%',
          height: 'calc(100% - 60px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <svg style={{
            display: 'block',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '5px',
            maxHeight: '500px'  // Adjust this value as needed
          }} ref={svgRef}></svg>
        </div>
        <p style={{
          marginTop: '10px',
          marginBottom: '0px',
          color: 'white',
          fontSize: '16px',
          position: 'absolute',
          left: '0%',
          transform: 'translate(-40%) rotate(-90deg)',
          whiteSpace: 'nowrap'
        }}>Amount of Hydrogen (kmol)</p>
        <p style={{
          marginTop: '10px',
        }}>No. of iterations</p>
      </div>
    </Modal>
  )
}
