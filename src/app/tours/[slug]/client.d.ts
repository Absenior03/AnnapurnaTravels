// Type declaration for the client component
declare module './client' {
  interface TourDetailClientProps {
    slug: string;
  }
  
  export default function TourDetailClient(props: TourDetailClientProps): JSX.Element;
} 