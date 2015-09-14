<?php

class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    protected $baseUrl = 'http://localhost';
    protected $headers = ['Authorization' => 'L3gkUwlwCQpUFGwbbX9HuAmc9YsMh8Oe42OQRNiY'];

    public function post($uri, $data = null, array $headers = [])
    {
        $server = $this->transformHeadersToServerVars($this->headers ?: $headers);
        $this->call('POST', $uri, [], [], [], $server, $data);

        return $this;
    }

    public function put($uri, $data = null, array $headers = [])
    {
        $server = $this->transformHeadersToServerVars(array_merge($this->headers, $headers));
        $this->call('PUT', $uri, [], [], [], $server, $data);

        return $this;
    }

    public function patch($uri, $data = null, array $headers = [])
    {
        $server = $this->transformHeadersToServerVars($this->headers ?: $headers);
        $this->call('PATCH', $uri, [], [], [], $server, $data);

        return $this;
    }

    public function delete($uri, $data = null, array $headers = [])
    {
        $server = $this->transformHeadersToServerVars($this->headers ?: $headers);
        $this->call('DELETE', $uri, [], [], [], $server, $data);

        return $this;
    }
    public function get($uri, $headers = [])
    {
        return parent::get($uri, $this->headers ?: $headers);
    }

    public function __call($method, $args)
    {
        if (starts_with($method, 'REST')) {
            $method = substr($method, 4);
        }
    }

    public function resetEvents()
    {
        $models = func_get_args();
        // Reset their event listeners.
        foreach ($models as $model) {

            // Flush any existing listeners.
            call_user_func(array($model, 'flushEventListeners'));

            // Reregister them.
            call_user_func(array($model, 'boot'));
        }
    }

    public function shared($var, $callback, $bind = true)
    {
        if (array_get(static::$shared, $var) === null) {
            static::$shared[$var] = $callback();
        }
        if ($bind) {
            $this->$var = array_get(static::$shared, $var);
        }
    }

    public function fetch($var)
    {
        return array_get(static::$shared, $var);
    }

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

        return $app;
    }
    public function tearDown()
    {
        $this->beforeApplicationDestroyed(function () {
            DB::disconnect();
        });

        parent::tearDown();
    }
}
