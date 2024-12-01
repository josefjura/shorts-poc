// @ts-check

const sources = [
	'./videos/test-video-1',
	'./videos/test-video-2',
	'./videos/test-video-3',
	'./videos/test-video-4',
	'./videos/test-video-5',
	'./videos/test-video-6',
	'./videos/test-video-7',
	'./videos/test-video-8',
	'./videos/test-video-9',
	'./videos/test-video-10',
];

/**
 * Generate players and add them to the DOM
 * @description This function generates video players
 * @returns {void}
 */
const generatePlayers = () => {
	const videoWrapper = document.querySelector('.video-wrapper');
	if (!videoWrapper) {
		console.error('No video wrapper found');
		return;
	}

	for (let i = 0; i < sources.length; i++) {
		const player = document.createElement('article');
		player.classList.add('video-item');
		player.dataset.index = `${i}`;
		player.draggable = true;
		player.innerHTML = generatePlaceholderDiv(i).outerHTML;

		videoWrapper.appendChild(player);
	}
}

/**
 * Generate placeholder div
 * @param {number} index
 * @returns {HTMLDivElement}
 * @description This function generates a placeholder div with the given index
 */
const generatePlaceholderDiv = (index) => {
	const placeholder = document.createElement('div');
	placeholder.classList.add('placeholder');
	placeholder.style.backgroundImage = `url(${sources[index]}.jpg)`;

	return placeholder;
}

/**
 * Generate video element
 * @param {number} index
 * @returns {HTMLVideoElement}
 * @description This function generates a video element with the given index
 */
const generateVideo = (index) => {
	const video = document.createElement('video');
	video.controls = true;
	video.classList.add('video');
	video.playsInline = true;
	video.loop = true;
	video.innerHTML = `
					<source src="${sources[index]}.mp4" type="video/mp4">
				`;

	return video;
}

generatePlayers();

window.addEventListener('keydown', (event) => {
	const container = document.querySelector('.section-container');
	if (!container) {
		console.error('No container found');
		return;
	}
	if (event.key === 'ArrowDown') {
		container.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
	} else if (event.key === 'ArrowUp') {
		container.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
	}
});

// IntersectionObserver setup
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				console.log('Video entered', entry.target.getAttribute('data-index'));
				handleVideoEnter(entry);
			} else {
				console.log('Video exited', entry.target.getAttribute('data-index'));
				handleVideoExit(entry);
			}
		});
	},
	{ threshold: 0.8 } // Trigger when 50% of the item is visible
);

document.querySelectorAll('.video-item').forEach(item => {
	observer.observe(item);
});

/**
 * Preload adjacent videos
 * @param {number} index 
 */
const preloadAdjacent = (index) => {
	if (index > 0) loadVideo(index - 1); // Preload previous
	if (index < sources.length - 1) loadVideo(index + 1); // Preload next
};

/**
 * Load video by index
 * @param {number} index
 */
const loadVideo = (index) => {
	const selector = `article[data-index="${index}"]`;
	const videoContainer = document.querySelector(selector);

	if (!videoContainer) {
		console.error('No video container found');
		return;
	}

	if (videoContainer && !videoContainer.querySelector('video')) {
		videoContainer.innerHTML = generateVideo(index).outerHTML;
	}
};

/**
 * Handler for when a video enters the viewport
 * @param {IntersectionObserverEntry} entry
 */
const handleVideoEnter = (entry) => {
	const { target } = entry;
	const index_str = target.getAttribute('data-index');

	if (!index_str) {
		console.error('No index attribute found on target');
		return;
	}

	// Remove the placeholder.
	// We can typecast the element to HTMLElement | null, this typecast
	// is typesafe in the way that every Elementis either a HTMLElement or an SVGElement.
	const placeholder = /** @type HTMLElement | null */(target.querySelector('.placeholder'));

	if (!placeholder) {
		console.error('No placeholder found');
		return;
	}

	placeholder.style.display = 'none';

	const index = parseInt(index_str, 10);

	// Add the video element
	const video = generateVideo(index);
	video.play();
	target.appendChild(video);
};

/**
 * Handler for when a video exits the viewport
 * @param {IntersectionObserverEntry} entry
 */
const handleVideoExit = (entry) => {
	const { target } = entry;

	// Remove the video element
	const video = target.querySelector('.video');



	if (video != null) {
		/** @type HTMLVideoElement */ (video).pause();
		/** @type HTMLVideoElement */ (video).currentTime = 0;
		target.removeChild(video);
	}


	// Show the placeholder
	const placeholder = /** @type HTMLElement | null */(target.querySelector('.placeholder'));

	if (!placeholder) {
		console.error('No placeholder found');
		return;
	}

	placeholder.style.display = 'block';
};