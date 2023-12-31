"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

const formSchema = z.object({
	email: z.string().min(2, {
		message: "Email must be at least 2 characters.",
	}),
	password: z.string().min(3, {
		message: "Password must be at least 2 characters.",
	}),
});

export default function Page() {
	const router = useRouter();
	const loginMutation = useMutation({
		mutationFn: (data: z.infer<typeof formSchema>) => {
			return axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/login`, data);
		},
		onSuccess: (data) => {
			console.log(data);

			if (data.data.redirect) {
				router.push(`/${data.data.redirect}`);
			}
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			loginMutation.mutate(values);
		} catch (error) {
			console.error("Error in Login", error);
		}
	}

	return (
		<div className="flex flex-col max-w-[500px] mx-4 md:mx-auto min-h-screen justify-center">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input {...field} type="password" />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={loginMutation.isLoading}>
						{loginMutation.isLoading ? "Verifying..." : "Submit"}
					</Button>
					{loginMutation.isError && (
						<FormDescription className="text-destructive-foreground bg-destructive p-2 rounded-sm max-w-[max-content]">
							Something went wrong
						</FormDescription>
					)}
				</form>
			</Form>
		</div>
	);
}
