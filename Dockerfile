FROM node:alpine
WORKDIR /app
RUN mkdir /app/.next/ && chown node -R /app/.next/
USER node
CMD ["yarn", "dev"]
