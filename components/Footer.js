import { Separator } from "@radix-ui/react-dropdown-menu";

const Footer = () => {
  return (
    <footer className="border-t pt-8">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="font-semibold mb-3">About Us</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Our Story
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Artists
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Exhibitions
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Shipping
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Returns
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Email Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Live Chat
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Phone Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="text-center text-muted-foreground">
        <p>&copy; 2023 Art Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
