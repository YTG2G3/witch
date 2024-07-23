import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

export default function Nav() {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link href="/" color="foreground">
          <h1 className="text-2xl tracking-wide font-bold">witch</h1>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button>Sign In</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
