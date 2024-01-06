import Button from '@/app/_components/Button';
import Card from '@/app/_components/Card';
import Input from '@/app/_components/Input';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Signup = () => {
    return (
        <Card transparency="transparent" layout="centered">
            <h3 className="mb-4">Sign up</h3>
            <form
                className="flex flex-col items-center gap-3 mt-8 mb-8 w-full"
                action="/auth/sign-up"
                method="post"
            >
                <Input
                    placeholder="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    prefix={
                        <AtSymbolIcon className="h-4 w-4 text-base-contrast" />
                    }
                />
                <Input
                    placeholder="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    prefix={
                        <LockClosedIcon className="h-4 w-4 text-base-contrast" />
                    }
                />
                <Button intent="primary">Sign up</Button>
            </form>
            <div className="mt-3 text-sm">
                Already a member?{' '}
                <Link href="login" className="text-accent">
                    Log in
                </Link>
            </div>
        </Card>
    );
};

export default Signup;
