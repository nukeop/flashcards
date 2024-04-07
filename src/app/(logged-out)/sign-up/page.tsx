import Button from '@/app/_components/Button';
import Card from '@/app/_components/Card';
import Input from '@/app/_components/client-side/Input';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Sign up',
    description: 'Sign up for an account',
};

const Signup = () => {
    return (
        <Card layout="centered">
            <h3 className="mb-4 text-center">Sign up</h3>
            <form
                className="mb-8 mt-8 flex w-full flex-col items-center gap-3"
                action="/auth/sign-up"
                method="post"
            >
                <Input
                    placeholder="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    prefix={<AtSymbolIcon className="h-4 w-4" />}
                />
                <Input
                    placeholder="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    prefix={<LockClosedIcon className="h-4 w-4" />}
                />
                <Button intent="primary">Sign up</Button>
            </form>
            <div className="mt-3 text-center text-sm">
                Already a member?{' '}
                <Link href="/login" className="text-stone-600">
                    Log in
                </Link>
            </div>
        </Card>
    );
};

export default Signup;
