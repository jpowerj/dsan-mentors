npx @11ty/eleventy
cp ./_rendered/mentor-hobbies/index.html ./_rendered/mentor-hobbies/hobbies.qmd
cp ./_rendered/mentor-strengths/index.html ./_rendered/mentor-strengths/strengths.qmd
quarto preview index.qmd --no-browser --no-watch-inputs
