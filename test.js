const { readFileSync, writeFileSync } = require('fs');
const { default: convert } = require('./dist');

const template = readFileSync('template.html').toString();

convert(process.argv[2] || 'a.jpeg', {
	spaceChars: 1,
}).then(text => {
	writeFileSync(
		'index.html',
		template.replace(
			'%BODY%',
			text.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />')
		)
	);
});
