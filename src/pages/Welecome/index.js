import React, { memo, useState, useEffect, useRef } from 'react'
import Breadcrumb from 'components/Breadcrumb';
import { Line, Pie } from '@ant-design/charts';
import { Card } from 'antd';

export default memo(function FCWelecom() {

	// 折线图
	const [lineData, setLineData] = useState([]);
	const lineRef = useRef(null)


	useEffect(() => {
		asyncFetch();
		lineRef.current = lineRef.current.getChart()
		pieRef.current = pieRef.current.getChart()
		console.log(pieRef.current)

		lineRef.current.on('tooltip:change', e => {
			if (!pieRef.current.update) pieRef.current = pieRef.current.getChart()
			console.log(e.data)
			pieConfig.data = e.data.items.map(el => el.data)
			pieRef.current.update(pieConfig)
		})

	}, []);


	const asyncFetch = () => {
		fetch('https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json')
			.then((response) => response.json())
			.then((json) => {
				setLineData(json)
				setPieData(json.filter(el => el.year === '2008'))
			})
			.catch((error) => {
				console.log('fetch data failed', error);
			});
	};
	var lineConfig = {
		data: lineData,
		xField: 'year',
		yField: 'gdp',
		seriesField: 'name',
		yAxis: {
			label: {
				formatter: function formatter(v) {
					return ''.concat((v / 1000000000).toFixed(1), ' B');
				},
			},
		},
		legend: { position: 'top' },
		smooth: true,
		animation: {
			appear: {
				animation: 'path-in',
				duration: 5000,
			},
		},
	};

	// 饼图
	const [pieData, setPieData] = useState([]);
	const pieRef = useRef(null)
	var pieConfig = {
		appendPadding: 10,
		data: pieData,
		angleField: 'gdp',
		colorField: 'name',
		radius: 0.9,
		label: {
			type: 'inner',
			offset: '-30%',
			content: function content(_ref) {
				var percent = _ref.percent;
				return ''.concat(percent * 100, '%');
			},
			style: {
				fontSize: 14,
				textAlign: 'center',
			},
		},
		interactions: [{ type: 'element-active' }],
	};

	return (
		<div>
			<Breadcrumb items={[{ path: '/home/welecome', label: '欢迎' }]} />
			<Card>
				<Pie {...pieConfig} ref={pieRef} />;
				<Line {...lineConfig} ref={lineRef} />;
			</Card>
		</div>
	)
})
