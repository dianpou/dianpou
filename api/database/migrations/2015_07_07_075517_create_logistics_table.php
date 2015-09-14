<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('logistics', function (Blueprint $table) {
            $table->increments('id');
            $table->string('logistics_name')->unique();
            $table->enum('status', ['enabled', 'disabled']);
            $table->text('logistics_desc')->default('');
            $table->string('deliverer_name')->default('simple');
            $table->jsonb('deliverer_settings')->default('{}');
            $table->jsonb('deliverer_cod')->default('[]');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('logistics');
    }
}
