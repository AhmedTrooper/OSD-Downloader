import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Alert
} from "@heroui/react";

import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="p-8 overflow-auto custom-scrollbar">
       <Alert color="warning" className="w-full">
            
              If you know the name of the train you have to use, you can select
              the train directly from dropdown below, otherwise don't change
              it...
           
          </Alert>
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold">About This App</h2>
        </CardHeader>
        <CardBody>
          <p className="text-base leading-relaxed">
            This desktop application is built using Tauri v2, React 18 with
            TypeScript, Tailwind CSS 3.4, Zustand for state management, and
            HeroUI for modern UI components. It supports light/dark mode and is
            optimized for performance and cross-platform compatibility.
          </p>
        </CardBody>
        <CardFooter>
         
          <Link to={"/"}>
            <Button color="primary">Home</Button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Your Company. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
