FROM mcr.microsoft.com/playwright:v1.56.0-noble 

RUN mkdir /petclinic
WORKDIR /petclinic
COPY . /petclinic/

RUN npm install --force
RUN npx playwright install
CMD ["npx", "playwright", "test", "--reporter=html"]
