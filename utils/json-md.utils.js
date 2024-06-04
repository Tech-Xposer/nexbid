import fs from 'fs/promises';
import path from 'path';
import json2md from 'json2md';

const generateReadme = async (postmanFilePath, outputFilePath) => {
  try {
    const postmanData = await fs.readFile(postmanFilePath, 'utf8');
    const postmanJson = JSON.parse(postmanData);

    const readmeContent = [];

    // Collection Name
    readmeContent.push({ h1: postmanJson.info.name });
    
    // Collection Description
    if (postmanJson.info.description) {
      readmeContent.push({ p: postmanJson.info.description });
    }

    // Add Bearer Token Section
    readmeContent.push({ h2: 'Authentication' });
    readmeContent.push({
      p: 'This API uses Bearer Token authentication. To access the endpoints, you need to provide a Bearer token in the Authorization header of your requests.'
    });
    readmeContent.push({
      code: {
        language: 'http',
        content: 'Authorization: Bearer <your-token-here>'
      }
    });

    // Iterate over the items in the collection
    for (const item of postmanJson.item) {
      readmeContent.push({ h2: item.name });

      if (item.request) {
        const request = item.request;

        // Request method and URL
        readmeContent.push({
          p: `**${request.method} ${request.url.raw}**`
        });

        // Request description
        if (request.description) {
          readmeContent.push({ blockquote: request.description });
        }

        // Request headers
        if (request.header && request.header.length > 0) {
          readmeContent.push({ h3: 'Headers' });
          const headersTable = request.header.map(header => ({
            Header: header.key,
            Value: header.value,
            Description: header.description || ''
          }));
          readmeContent.push({ table: { headers: ["Header", "Value", "Description"], rows: headersTable } });
        }

        // Request body (for POST, PUT requests)
        if (request.body && request.body.raw) {
          readmeContent.push({ h3: 'Body' });
          readmeContent.push({ code: { language: 'json', content: request.body.raw } });
        }

        // Response examples (optional, depending on your Postman collection)
        if (item.response && item.response.length > 0) {
          readmeContent.push({ h3: 'Responses' });
          item.response.forEach(response => {
            readmeContent.push({ h4: `Response: ${response.name}` });
            if (response.body) {
              readmeContent.push({ code: { language: 'json', content: response.body } });
            }
          });
        }
      }
    }

    // Convert the JSON structure to Markdown
    const markdownContent = json2md(readmeContent);

    // Write the Markdown content to a README.md file
    await fs.writeFile(outputFilePath, markdownContent, 'utf8');
    console.log('README.md has been generated successfully!');
  } catch (error) {
    console.error('Error generating README.md:', error);
  }
};

const postmanFilePath = path.resolve("/Users/ashutosh/Developer/Task's Projects/NexBid/NexBid.postman_collection.json");
const outputFilePath = path.resolve("/Users/ashutosh/Developer/Task's Projects/NexBid/README.md");

generateReadme(postmanFilePath, outputFilePath);
