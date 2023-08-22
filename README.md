# saasrock-kb

### What is SaasRock KB?

This is the Knowledge Base feature of [SaasRock](https://saasrock.com/?ref=saasrock-kb&utm_source=readme). I used **Intercom** and **Crisp** help centers as "inspiration" 😛.

![SaasRock KB](https://yahooder.sirv.com/saasrock-kb/cover.png)

### Demo

- Try it out: [https://kb.saasrock.com/](https://kb.saasrock.com/)
- [Watch the introduction video demo](https://www.loom.com/share/c5d6a04da4214e3689b38d0e5d211e25)

### Getting Started

1. Install dependencies:

```
npm install
```

2. Initialize the database _(the `schema.prisma` db provider must match the `DATABASE_URL` provider)_:

```
npx prisma migrate dev --name init
```

or

```
npx prisma db push
```

3. Start the development server:

```
npm run dev
```

### Features

- **WYSIWYG** editor: [Tiptap](https://tiptap.dev/) editor with AI-powered suggestions (thanks to [Novel.sh](https://novel.sh/?ref=saasrock-kb))
- **Markdown** editor: [Monaco](https://github.com/suren-atoyan/monaco-react) editor with markdown support.
- **Multi-knowlege-base** support: Create multiple knowledge bases for different purposes.
- **Multi-language** support: Add categories and articles in multiple languages.
- **Simple Analytics**: Views, Upvotes, and Downvotes tracking.
- **Image storage** with Supabase: Upload article images to [Supabase](https://supabase.io) Storage.
- **SEO**: Add SEO title, description, and image to your articles.
- **Article Duplication**: Duplicate articles so you don't start from scratch.
- **Article Drafts**: Save your articles as drafts and publish them when you're ready.
- **Import and Export**: Don't lose your data, import and export your knowledge bases.

### Community

- Join the [Discord](https://discord.gg/KMkjU2BFn9) to chat with other SaasRock users or to DM me directly.
- Follow [SaasRock](https://twitter.com/saas_rock) or [me](https://twitter.com/AlexandroMtzG) on Twitter.

### SaasRock

If you liked this project, you might also like [SaasRock](https://saasrock.com/?ref=saasrock-kb&utm_source=readme), a SaaS starter kit that helps you build your SaaS faster.

### Docker

To run the project in docker, create the .env file and add in the variables as in the .env.example file
You will need to initiate a new instance on supabase and copy-paste the creds into the .env file
Build the image then run it with docker-compose file
Feel free to make changes that suit your docker needs
Done by https://github.com/32dantey/



### License

Licensed under the MIT License.

### Sponsor

If you find **SaasRock KB** useful and would like to support its development, consider becoming a sponsor. Your sponsorship will help ensure the continued maintenance and improvement of this project.

You can sponsor me on [GitHub Sponsors](https://github.com/sponsors/AlexandroMtzG). Every contribution is highly appreciated!



