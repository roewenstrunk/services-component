const styleContainer = document.createElement('template');
styleContainer.innerHTML = `
<style>
    .container {
        margin-left: auto;
        margin-right: auto;
        padding-left: .4rem;
        padding-right: .4rem;
        width: 100%;
    }
    
    .service {
        margin-top: .5rem;
    }
    
    .info {
        font-size: .8em;
        color: #999;
        padding-left: 1rem;
    }
    
    .dot {
        height: 17px;
        width: 17px;
        border-radius: 50%;
        display: inline-block;
    }
    
    .dot.grey{
        background-color:grey;
    }
    
    .dot.green {
        background-color: green;
    }
    
    .dot.red{
        background-color:red;
    }
    
    .columns {
        display: -webkit-box;
        display: flex;
        display: -ms-flexbox;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-left: -.4rem;
        margin-right: -.4rem;
    }
    
    .col-10 {
        width: 83.33333333%;
    }

    .col-2 {
        width: 16.66666667%;
    }

    .col-12 {
        width: 100%;
    }
    
</style>
`;

const serviceContainer = document.createElement('template');
serviceContainer.innerHTML = `
  <div class="service container">
    <div class="columns">
        <div class="col-10"><span class="service-name"></span><span>, </span><a class="service-link" href="" target="_blank"><span class="service-url"></span></a>
        </div>
        <div class="col-2"><span title="" class="dot"></span>
        </div>
    </div>
    <div class="columns">
        <div class="col-12 info"><span class="service-ip"></span>, <span class="service-cluster"></span></div>
    </div>
  </div>
`;

class Services extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    addService(serviceName, serviceURL, serviceIP, serviceCluster, serviceStatus) {
        let service = serviceContainer.content.cloneNode(true);
        service.querySelector('.service-name').innerHTML = serviceName;
        service.querySelector('.service-link').href = serviceURL;
        service.querySelector('.service-url').innerHTML = serviceURL;
        service.querySelector('.service-ip').innerHTML = serviceIP;
        service.querySelector('.service-cluster').innerHTML = serviceCluster;

        let serviceStatusColor = 'grey';
        let serviceStatusTitle = 'Service is paused';

        if(serviceStatus == 2) {
            serviceStatusColor = 'green';
            serviceStatusTitle = 'Service is running';
        }else if(serviceStatus == 8 || serviceStatus == 9) {
            serviceStatusColor = 'red';
            serviceStatusTitle = 'Service is down';
        }




        service.querySelector('.dot').title = serviceStatusTitle;
        service.querySelector('.dot').className = 'dot ' + serviceStatusColor;

        this._shadowRoot.appendChild(service);
    }

    get services() {
        return this._services;
    }

    set services(value) {
        this._services = value;
        this.render();
    }

    render() {

        this._shadowRoot.innerHTML = '';
        this._shadowRoot.appendChild(styleContainer.content.cloneNode(true));

        this._services.monitors.forEach(service => {
            this.addService(
                service.friendly_name,
                service.url,
                service.ip,
                service.cluster,
                service.status
            )
        });
    }
}

window.customElements.define('services-component', Services);