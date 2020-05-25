import {useCallback, useMemo, useRef} from 'react';

import './Tooltip.less';

const getOffset = (position, size, windowSize) =>
	position < 0 ? -position : position + size > windowSize ? windowSize - position - size : 0;

const updatePosition = (target, tooltip, placement) => {
	const {left, top, width, height} = target.getBoundingClientRect();
	const {width: childWidth, height: childHeight} = tooltip.getBoundingClientRect();

	let tooltipLeft, tooltipTop, arrowLeft, arrowTop;
	if (placement === 'left' || placement === 'right') {
		tooltipTop = top + (height - childHeight) / 2;
		tooltipLeft = left + (placement === 'left' ? -childWidth : width);
		const offset = getOffset(tooltipTop, childHeight, window.innerHeight);
		tooltipTop += offset;
		arrowTop = 50 * (1 - (2 * offset) / childHeight) + '%';
	} else {
		tooltipLeft = left + (width - childWidth) / 2;
		tooltipTop = top + (placement === 'top' ? -childHeight : height);
		const offset = getOffset(tooltipLeft, childWidth, window.innerWidth);
		tooltipLeft += offset;
		arrowLeft = 50 * (1 - (2 * offset) / childWidth) + '%';
	}

	tooltip.style.left = tooltipLeft + 'px';
	tooltip.style.top = tooltipTop + 'px';

	const arrow = tooltip.lastChild;
	arrow.style.left = arrowLeft;
	arrow.style.top = arrowTop;
};

const createTooltip = (text, placement) => {
	const tooltip = document.createElement('div');
	tooltip.id = 'tooltip';
	tooltip.className = 'Tooltip Tooltip--' + placement;

	const body = document.createElement('div');
	body.className = 'Tooltip__body';
	body.textContent = text;
	tooltip.appendChild(body);

	const arrow = document.createElement('div');
	arrow.className = 'Tooltip__arrow';
	tooltip.appendChild(arrow);

	return tooltip;
};

export default (text, placement) => {
	const targetRef = useRef(null);
	const timerRef = useRef(0);
	const tooltip = useMemo(() => createTooltip(text, placement), [text, placement]);
	const show = useCallback(() => {
		if (text) {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = 0;
			}

			document.body.appendChild(tooltip);
			// eslint-disable-next-line no-unused-expressions
			tooltip.scrollTop; // force layout to start transition
			tooltip.classList.add('Tooltip--visible');

			const target = targetRef.current;
			target.setAttribute('aria-describedby', 'tooltip');
			updatePosition(target, tooltip, placement);
		}
	}, [text, placement, tooltip]);
	const hide = useCallback(() => {
		if (tooltip.parentNode) {
			tooltip.classList.remove('Tooltip--visible');

			timerRef.current = setTimeout(() => {
				targetRef.current.removeAttribute('aria-describedby');
				document.body.removeChild(tooltip);
				timerRef.current = 0;
			}, 300);
		}
	}, [tooltip]);

	return useCallback(
		(element) => {
			const target = targetRef.current;
			if (target) {
				target.removeEventListener('mouseenter', show);
				target.removeEventListener('mouseleave', hide);
				target.removeEventListener('focus', show);
				target.removeEventListener('blur', hide);

				if (timerRef.current) {
					clearTimeout(timerRef.current);
					timerRef.current = 0;
				}
				if (tooltip.parentNode) {
					targetRef.current.removeAttribute('aria-describedby');
					document.body.removeChild(tooltip);
				}
			}
			if (element) {
				element.addEventListener('mouseenter', show);
				element.addEventListener('mouseleave', hide);
				element.addEventListener('focus', show);
				element.addEventListener('blur', hide);
			}
			targetRef.current = element;
		},
		[hide, show, tooltip, targetRef]
	);
};
