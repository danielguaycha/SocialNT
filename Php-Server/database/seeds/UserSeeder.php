<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name'=> 'Daniel',
            'lastname'=> 'Guaycha',
            'username'=> 'daniel',
            'email'=> 'daniel@mail.com',
            'genero'=> 'M',
            'avatar'=> 'avatar.png',
            'password'=> '$2b$10$b8BjVk1f16eGah6Or8igfOVgnwp8nXEmxOBv0U0dJEyUb1tPU5FbO', // 123
            'confirmation_code'=> null, 
            'confirmed'=> 1
        ]);

        DB::table('users')->insert([
            'name'=> 'Guido',
            'lastname'=> 'Pesantez',
            'username'=> 'guido',
            'email'=> 'guido@mail.com',
            'genero'=> 'M',
            'avatar'=> 'avatar.png',
            'password'=> '$2b$10$b8BjVk1f16eGah6Or8igfOVgnwp8nXEmxOBv0U0dJEyUb1tPU5FbO', // 123
            'confirmation_code'=> null, 
            'confirmed'=> 1
        ]);

        DB::table('users')->insert([
            'name'=> 'Andres',
            'lastname'=> 'Loayza',
            'username'=> 'andres',
            'email'=> 'andres@mail.com',
            'genero'=> 'M',
            'avatar'=> 'avatar.png',
            'password'=> '$2b$10$b8BjVk1f16eGah6Or8igfOVgnwp8nXEmxOBv0U0dJEyUb1tPU5FbO', // 123
            'confirmation_code'=> null, 
            'confirmed'=> 1
        ]);

        DB::table('users')->insert([
            'name'=> 'Ronald',
            'lastname'=> 'Ganan',
            'username'=> 'ronald',
            'email'=> 'ronald@mail.com',
            'genero'=> 'M',
            'avatar'=> 'avatar.png',
            'password'=> '$2b$10$b8BjVk1f16eGah6Or8igfOVgnwp8nXEmxOBv0U0dJEyUb1tPU5FbO', // 123
            'confirmation_code'=> null, 
            'confirmed'=> 1
        ]);

        factory(App\User::class, 100)->create();
    }
    
}
