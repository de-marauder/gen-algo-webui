'use client'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { DataPoints, GraphItemsKeys } from '@/app/(Dashboard)/dashboard/visualisation/_helpers';
import Loading from '@/app/(Dashboard)/dashboard/visualisation/loading';
import { Button } from '../Buttons/Buttons';
import { Blur } from '../utils/Blur';


export const LineChart: React.FC<{
  caption: string;
  xLabel: string;
  yLabel: string;
  outerSection: MutableRefObject<HTMLDivElement | null>;
  item: GraphItemsKeys;
  fetchData: (url: string, item: GraphItemsKeys) => Promise<{
    graph: DataPoints;
    error: null;
  } | {
    error: Error;
    graph: null;
  }>;
  configId: string
}> = ({ configId, caption, xLabel, yLabel, outerSection, fetchData, item }) => {
  const [data, setData] = useState<DataPoints | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(false)
  const doReload = () => {
    setError('');
    setReload(true)
  }
  useEffect(() => {
    // console.log(reload)
    setReload(false)
    setError('')
    if (!configId || configId.length !== 24) return setError('No Config selected')
    const url = `${process.env.NEXT_PUBLIC_API_URL}/runs?configId=${configId}`;
    // console.log('graph useEffect running')
    fetchData(url, item)
      .then(({ graph, error }) => {
        if (error) throw new Error(error.message);
        setData(graph)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        // console.log('Error = ', error)
        // handle error
        setError(error.message)
      })
  }, [fetchData, item, reload, configId])

  const svgRef = useRef(null);
  // Initialize the width state with the initial window width
  const wrapperContainer = outerSection.current?.clientWidth ?? 0;

  // Function to update the width state based on the current window width
  const selectWidth = () => {
    if (wrapperContainer && (wrapperContainer > 1000)) {
      return (wrapperContainer && (wrapperContainer / 3))
    } else if (wrapperContainer && (wrapperContainer > 500) && wrapperContainer && (wrapperContainer <= 1000)) {
      return (wrapperContainer && (wrapperContainer / 2))
    }
    else {
      return (500);
    }
  }

  const margin = useMemo(() => ({ top: 20, right: 30, bottom: 30, left: 40 }), []);
  // const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = selectWidth() - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current || !data?.length) return;
    const x = data.map((el) => el[0])
    const y = data.map((el) => el[1])
    // Set up the dimensions and margins for the chart

    // Create an SVG container
    const svg = d3.select(svgRef.current);

    svg.selectAll('g').remove();
    svg.selectAll('path').remove();
    svg.selectAll('rect').remove();
    svg.selectAll('line').remove();
    svg.selectAll('circle').remove();
    svg.selectAll('text').remove();

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    // Define scales for x and y axes
    const minx = Math.min(...x)
    const maxx = Math.max(...x)
    const xScale = d3.scaleLinear()
      .domain([minx - (minx / 10), maxx + (maxx / 10)]) // Assuming data is an array of values
      .nice()
      .range([0, width]);

    const miny = Math.min(...y)
    const maxy = Math.max(...y)
    const yScale = d3.scaleLinear()
      .domain([miny - (miny / 10), maxy + (maxy / 10)]) // Assuming data is an array of values
      .nice()
      .range([height, 0]);

    // Add gridlines for both x and y axes
    svg.append('g')
      .attr('class', 'grid')
      .attr('color', 'grey')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(xScale)
        .ticks(20)
        .tickSize(-height)
        .tickFormat(() => '')
      );

    svg.append('g')
      .attr('class', 'grid')
      .attr('color', 'grey')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale)
        .ticks(20)
        .tickSize(-width)
        .tickFormat(() => '')
      );

    // Create the line generator
    const line = d3.line<DataPoints[0]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    // Create the x-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(xScale));

    // Create the y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale));

    // Render the line
    svg.append('path')
      .datum(data)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue') // Line color
      .attr('stroke-width', 2) // Line width
      .transition()
      .attr('d', line)
      .call((path) => path.transition()
        .duration(3000) // Duration of the animation in milliseconds
        .attrTween('stroke-dasharray', () => {
          const length = path.node()?.getTotalLength();
          return d3.interpolate(`0,${length}`, `${length},${length}`);
        })
      );

    // Initialize horizontal and vertical lines, initially hidden
    const horizontalLine = svg.append('line')
      .attr('class', 'horizontal-line')
      .style('stroke', 'gray')
      .style('stroke-dasharray', '3, 3')
      .attr('x1', margin.left)
      .attr('x2', width + margin.left)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('opacity', 0);

    const verticalLine = svg.append('line')
      .attr('class', 'vertical-line')
      .style('stroke', 'gray')
      .style('stroke-dasharray', '3, 3')
      .attr('x1', margin.left)
      .attr('x2', 0)
      .attr('y1', margin.top)
      .attr('y2', height + margin.top)
      .style('opacity', 0);

    // Add a transparent overlay to capture mouse events
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        horizontalLine.style('opacity', 1);
        verticalLine.style('opacity', 1);
      })
      .on('mousemove', (event) => {
        const [mouseX, mouseY] = d3.pointer(event);

        horizontalLine.attr('y1', mouseY + margin.top).attr('y2', mouseY + margin.top);
        verticalLine.attr('x1', mouseX + margin.left).attr('x2', mouseX + margin.left);
      })
      .on('mouseout', () => {
        horizontalLine.style('opacity', 0);
        verticalLine.style('opacity', 0);
      });

    // Add a hover effect
    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('class', 'dot')
      .attr('cx', (d, i) => xScale(d[0]))
      .attr('cy', (d) => yScale(d[1]))
      .attr('r', 4) // Radius of the circle
      .attr('fill', 'orange')
      .on('mouseover', (event, d) => {
        const [mouseX, mouseY] = d3.pointer(event);
        // Handle mouseover event (show tooltip)
        tooltipBackground
          .attr('fill', 'black')
          .attr('width', '120')
          .attr('height', '50')
          .attr('x', mouseX - 30)
          .attr('y', mouseY - 30);

        tooltipTextX
          .attr('x', mouseX - 20)
          .attr('y', mouseY - 10)
          .text(`x = ${d[0]}`)
        tooltipTextY
          .attr('x', mouseX - 20)
          .attr('y', mouseY + 10)
          .text(`y = ${d[1]}`)
      })
      .on('mouseout', (event, d) => {
        // Handle mouseout event (hide tooltip)
        tooltipBackground.attr('fill', 'none')
        tooltipTextX.text('')
        tooltipTextY.text('')
      });

    // tooltip for data point
    const tooltipBackground = svg.
      append('rect')
    const tooltipTextX = svg.append('text')
      .attr('fill', 'white')
    const tooltipTextY = svg.append('text')
      .attr('fill', 'white');

  }, [data, margin, width, height]);

  const svgWidth = `${width + margin.left + margin.right}px`;
  const svgHeight = `${height + margin.top + margin.bottom}px`;

  return (
    <>
      <div className='w-fit relative p-4 pl-8 hover:bg-grey-100'>
        <div className='relative w-fit ring-4 ring-inset ring-gray-700 rounded-xl'>
          <p className='absolute w-full text-center rotate-[-90deg] translate-x-[-52%] translate-y-[-100%] bottom-[40%]'>{yLabel}</p>
          {(loading && !reload) && <Loading />}
          {error && (
            <div className='p-4 grid place-items-center rounded-xl absolute top-0 left-0 bottom-0 right-0 bg-blue-800/10 backdrop-blur-3xl'>
              <center>
                <p className='text-red'>{error}</p>
                <Button type='sm' onClick={doReload}>Retry</Button>
              </center>
            </div>
          )}
          <Blur styles={''} />
          <svg
            ref={svgRef}
            // className={`
            // // w-[300px] h-[300px] 
            // // md:w-[${svgWidth}] sm:h-[${svgHeight}]
            // `} 
            width={svgWidth} height={svgHeight}
          ></svg>
          <p className='text-center'>{xLabel}</p>
        </div>
        <figcaption className='mt-2 text-center text-xl'><strong>{caption}</strong></figcaption>
      </div>
    </>
  );
};

