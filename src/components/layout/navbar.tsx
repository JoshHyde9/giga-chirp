import Link from "next/link";
import { Bell, Cherry, House, Search, UserRound } from "lucide-react";

import { auth } from "@/auth";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserAvatar } from "@/components/user/user-button";
import { Button } from "@/components/ui/button";

export const Navbar = async () => {
  const session = await auth();

  return (
    <NavigationMenu className="sticky top-0 h-screen">
      <NavigationMenuList className="flex flex-col h-full w-full py-2 gap-y-2">
        <NavigationMenuItem className="ml-2">
          <Link href="/home" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Cherry />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/home" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Search />
              <span className="ml-2">Home</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/explore" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <House />
              <span className="ml-2">Explore</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {session && (
          <>
            <NavigationMenuItem>
              <Link href="/notifications" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Bell />
                  <span className="ml-2">Notifications</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={`/${session.user.username}`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <UserRound />
                  <span className="ml-2">Profile</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Button className="w-5/6 mt-2">Post</Button>
            </NavigationMenuItem>

            <NavigationMenuItem className="mt-auto">
              <NavigationMenuLink className={navigationMenuTriggerStyle() + " w-full"}>
                <UserAvatar session={session} />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
        {!session && (
          <NavigationMenuItem className="">
            <Link href="/signin" legacyBehavior passHref>
              <Button className="w-full">Sign in</Button>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
