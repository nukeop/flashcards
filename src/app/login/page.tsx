import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import Button from '../_components/Button';
import Card from '../_components/Card';
import Input from '../_components/Input';

const Login = () => {
    return (
        <Card transparent layout="centered">
            <h3 className="mb-4 text-center">Log in</h3>
            <form
                className="flex flex-col items-center gap-3 mt-8 mb-8 w-full"
                action="/auth/login"
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
                <Button intent="primary">Log in</Button>
            </form>
            <div className="mt-3 text-sm text-center">
                Not a member?{' '}
                <Link href="/login/sign-up" className="text-accent">
                    Sign up
                </Link>
            </div>
        </Card>
    );
};

export default Login;
