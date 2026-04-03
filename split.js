const fs = require('fs');

const fileContent = fs.readFileSync('index.html', 'utf8');
const topHtmlSplit = fileContent.split('<!-- ================= SLIDE 1');
const topHtml = topHtmlSplit[0];

const sectionsMatches = fileContent.match(/<section class="slide theme-[^>]+>[\s\S]*?<\/section>/g);

const scriptSection = `
    </div>
    <script>
        document.addEventListener('keydown', function(event) {
            let currentPath = window.location.pathname.split('/').pop() || 'index.html';
            let currentIndex = 1;
            if (currentPath.startsWith('slide-')) {
                let match = currentPath.match(/slide-(\\d+)\.html/);
                if (match) currentIndex = parseInt(match[1], 10);
            }

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
                let next = currentIndex + 1;
                if (next <= 12) window.location.href = "slide-" + next + ".html";
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
                let prev = currentIndex - 1;
                if (prev === 1) window.location.href = "index.html";
                else if (prev > 1) window.location.href = "slide-" + prev + ".html";
            }
        });
    </script>
</body>
</html>`;

if (sectionsMatches && sectionsMatches.length === 12) {
    sectionsMatches.forEach((sectionHtml, index) => {
        let slideIndex = index + 1;
        let fileName = slideIndex === 1 ? 'index.html' : 'slide-' + slideIndex + '.html';
        
        let fullHtml = topHtml + 
                       '        <!-- ================= SLIDE ' + slideIndex + ' ================= -->\n        ' + 
                       sectionHtml + '\n' +
                       scriptSection;
        
        fs.writeFileSync(fileName, fullHtml);
        console.log('Created ' + fileName);
    });
} else {
    console.log('Failed to parse exactly 12 sections. Found: ' + (sectionsMatches ? sectionsMatches.length : 0));
}
