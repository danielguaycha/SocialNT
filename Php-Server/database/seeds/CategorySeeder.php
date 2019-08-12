<?php

use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert([
            ['name' => 'Moda'],
            ['name' => 'Zapatos'],
            ['name' => 'Tecnología'],
            ['name' => 'Electródomesticos'],
            ['name' => 'Hogar'],
            ['name' => 'Ferreteria'],
            ['name' => 'Relojería'],
            ['name' => 'Celulares'],
            ['name' => 'Computadores'],
        ]);
    }
}
