This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install all dependencies lib need to use in this project

```bash
# run to install all dependencies
npm install
```

Second run the development server:

```bash
# run to build app to build and download all missing source
npm run build

# run the server with
npm run dev

# run to test app with
npm run test
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`Inter`](https://fonts.google.com/specimen/Inter) font from Google Fonts.

## API Swagger UI

Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Learn React.js](https://react.dev/learn) - a framework work with components.
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Learn App Router](https://nextjs.org/docs/app/building-your-application/routing) - Routing pages together.
- [Learn Tailwind CSS](https://tailwindcss.com/) - Css template
- [Learn Node.js](https://nodejs.org/en) - Js environment

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Dir Tree

## Project Directory Structure

This is the directory structure of the project:

```
/src
│
├── /api # Chứa các api để truy vấn data (backend)
│ ├── /admin
│ │ └── AdminAPI.ts
│
├── /app # Chứa các page của Next.js hiển thị lên client-side
│ ├── /login
│ │ └── page.tsx
│ └── page.tsx
│
├── /components # Chứa các React component để tái sử dụng cho toàn bộ chương trình.
│ └── Header.tsx
│
├── /contexts # Chứa các React context để quản lý trạng thái toàn cục của ứng dụng (ví dụ: AuthContext, ThemeContext).
│ └── AuthContext.tsx
│
├── /hooks # Chứa các custom React hooks mà bạn có thể sử dụng để quản lý logic của component.
│ └── useAuth.ts
│
├── /layouts # Chứa cấu trúc layout cho web, bao gồm layout chung (hoặc riêng từng page) cho project.
│ └── header.ts
│ └── footer.ts
│
├── /lib # Chứa các thư viện hoặc kết nối bên ngoài như kết nối tới database, cấu hình Auth, hoặc API services.
│ └── prisma.ts
│
├── /middleware # Chứa các file middleware, ví dụ như authen, báo lỗi, bảo mật, routing, dùng api middleware từ bên ngoài.
│ └── auth.ts
│
├── /public # Chứa các file tĩnh (static files) như hình ảnh, fonts, hay các file tải lên.
│ └── /images
│ └── logo.png
│
├── /styles # Chứa các file CSS toàn cục (global styles) hoặc các file liên quan đến giao diện của ứng dụng.
│ └── globals.css
│
├── /tests # Chứa các file kiểm thử (test) cho từng component hoặc feature
│ └── Header.test.tsx
│
├── /types # Chứa các file định nghĩa kiểu dữ liệu TypeScript cho ứng dụng
│ └── user.ts
│
├── /utils # Chứa các function tiện ích hoặc các helper function như xử lý API, format dữ liệu, hoặc các tính toán khác.
│ └── fetcher.ts
│
├── .env.local
├── next.config.js
├── tsconfig.json
├── package.json
├── ....
└── README.md
```
