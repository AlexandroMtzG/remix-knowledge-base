# Define the base image version
FROM node:18.17.1-alpine3.17

# Environment variables
ENV SESSION_SECRET=${SESSION_SECRET}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV LOGGED_AS_ADMIN=${LOGGED_AS_ADMIN}
ENV DATABASE_URL=${DATABASE_URL}
ENV SUPABASE_API_URL=${SUPABASE_API_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}
ENV SUPABASE_ANON_PUBLIC_KEY=${SUPABASE_ANON_PUBLIC_KEY}

# Set the workdirectory of the project
WORKDIR /saasrock-kb/

# Copy dependencies file to docker image
COPY ./package.json /saasrock-kb/

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . /saasrock-kb/

# Initialize the db
RUN npx prisma migrate dev --name init

# Start the application
CMD [ "npm", "run", "dev" ]