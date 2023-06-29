# saasrock-kb

### What is SaasRock KB?

This is the Knowledge Base feature of [SaasRock](https://saasrock.com/?ref=saasrock-kb&utm_source=admin). I used **Intercom** and **Crisp** help centers as "inspiration" 😛.

![SaasRock KB](https://yahooder.sirv.com/saasrock-kb/cover.png)

### Demo

- Try it out: [https://kb.saasrock.com/](https://kb.saasrock.com/)
- Watch a demo: [https://www.youtube.com/watch?v=8Z3Z2Z2Z2Z2](https://www.youtube.com/watch?v=8Z3Z2Z2Z2Z2)

### Getting Started

1. Install dependencies:

```
npm install
```

2. Set the `DATABASE_URL` environment variable. Keep in mind that your `schema.prisma` db provider must match the `DATABASE_URL` provider.

3. Initialize the database:

```
npx prisma migrate dev --name init
```

or

```
npx prisma db push
```

4. Start the development server:

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

### License

Licensed under the MIT License.

### Sponsor

If you find **SaasRock KB** useful and would like to support its development, consider becoming a sponsor. Your sponsorship will help ensure the continued maintenance and improvement of this project.

You can sponsor me on [GitHub Sponsors](https://github.com/sponsors/AlexandroMtzG). Every contribution is highly appreciated!
