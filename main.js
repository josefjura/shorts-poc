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

sources.forEach((source, index) => {

	const videoContainer = document.querySelector('.video-container');

	if (!videoContainer) {
		console.error('No video container found');
		return;
	}

	videoContainer.appendChild(createArticle(source, index));
});

function createPlaceholder(source) {
	const placeholder = document.createElement('div');
	placeholder.classList.add('placeholder');
	placeholder.style.backgroundImage = `url(${source}.jpg)`;
	return placeholder;
}

function createArticle(source, index) {
	const article = document.createElement('article');
	article.classList.add('video-wrapper');
	article.dataset.index = index;
	const placeholder = createPlaceholder(source);
	article.appendChild(placeholder);
	return article;
}

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			console.log('Intersecting', entry.target);
			// If entry does not have a video element
			if (!entry.target.querySelector('video')) {
				const video = document.createElement('video');
				video.className = 'current-video';
				video.controls = true;
				video.loop = true;

				const index = /** @type HTMLElement */(entry.target).dataset.index;

				if (index === undefined) {
					console.error('Data attribute index not found on video wrapper');
					return;
				}

				const source = sources[index];
				const videoSource = document.createElement('source');
				videoSource.src = `${source}.mp4`;

				video.appendChild(videoSource);

				// Delete any other video elements
				const videos = document.querySelectorAll('.current-video');
				videos.forEach((video) => video.remove());

				entry.target.appendChild(video);

			}
		}
	});
}, { threshold: 0.4 });

const videos = document.querySelectorAll('.video-wrapper');
videos.forEach((video) => observer.observe(video));