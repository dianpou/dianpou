<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client as HTTPClient;
use GuzzleHttp\Psr7\Reqeuest;
use App\Models\Region;

class RegionSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'regions:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync region data from geonames';
    protected $client = null;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->client = new HTTPClient();
    }

    public function request($api, $params)
    {
        $url = 'http://api.geonames.org/' . $api . '?' . http_build_query(array_merge($params, [
            'username' => 'garbin'
        ]));
        $response = $this->client->get($url);

        return json_decode($response->getBody(), true);
    }


    public function syncRegions($geonameId, $parent = null, $level = 1)
    {
        if ($level > 2) { return; }
        $geonames = $this->request('childrenJSON', ['geonameId'=>$geonameId]);
        if (empty($geonames['geonames'])) {
            return;
        }
        foreach ($geonames['geonames'] as $geoname) {
            $data = [
                    'name' => $geoname['name'],
                    'short' => $geoname['fcode'] == 'ADM1' ? $geoname['adminCode1'] : '',
                    'parent_id' => $parent ? $parent->id : 0,
            ];
            $region = Region::updateOrCreate($data);
            $this->info("Inserted {$region->name}");
            $this->syncRegions($geoname['geonameId'], $region, $level + 1);
        }
    }


    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $country  = 'US';
        $countryInfo = $this->request('countryInfoJSON', ['country'=>$country]);

        $this->syncRegions($countryInfo['geonames'][0]['geonameId']);

        $this->info('Synced');
    }
}
